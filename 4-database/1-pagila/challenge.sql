
/*
    Challenge 1.
    Write a SQL query that counts the number of films in each category in the Pagila database.
    - The query should return two columns: category and film_count
    - category should display the name of each category
    - film_count should show the total number of films in that category
    - Results should be grouped by category name
 */


-- your query here
    SELECT c.name category, COUNT(fc.film_id) film_count
    FROM category c
    INNER JOIN film_category fc USING(category_id)
    GROUP BY c.name;

 /*
    Challenge 2.
    Write a SQL query that finds the top 5 customers who have spent the most money in the Pagila database.
    - The query should return three columns: first_name, last_name, and total_spent
    - total_spent should show the sum of all payments made by that customer
    - Results should be ordered by total_spent in descending order
    - The query should limit results to only the top 5 highest-spending customers
 */

 -- your query here
    SELECT c.first_name, c.last_name, SUM(p.amount) total_spent
    FROM customer c
    INNER JOIN payment p USING(customer_id)
    GROUP BY c.customer_id, c.first_name, c.last_name
    ORDER BY total_spent DESC
    LIMIT 5;

/*
    Challenge 3.
    Write a SQL query that lists all film titles that have been rented in the past 10 years in the Pagila database.
    - The query should return one column: title
    - title should display the name of each film that has been rented
    - The time period for "recent" should be within the last 10 years from the current date
    - Results should only include films that have rental records in this time period
*/

-- your query here
    SELECT DISTINCT f.title
    FROM film f
    INNER JOIN inventory i USING(film_id)
    INNER JOIN rental r USING(inventory_id)
    WHERE AGE(r.rental_date) < '10 years'::interval;

    
/*
    Challenge 4.
    Write a SQL query that lists all films that have never been rented in the Pagila database.
    - The query should return two columns: title and inventory_id
    - title should display the name of each film that has never been rented
    - inventory_id should show the inventory ID of the specific copy
*/

-- your query here
    SELECT f.title, i.inventory_id 
    FROM film f
    INNER JOIN inventory i USING(film_id)
    WHERE NOT EXISTS (
        SELECT 1 FROM rental r WHERE i.inventory_id = r.inventory_id
    );

/*
    Challenge 5.
    Write a SQL query that lists all films that were rented more times than the average rental count per film in the Pagila database.
    - The query should return two columns: title and rental_count
    - title should display the name of each film
    - rental_count should show the total number of times the film was rented
*/


-- your query here
    SELECT f.title, COUNT(r.rental_id) rental_count
    FROM film f
    INNER JOIN inventory i USING(film_id)
    INNER JOIN rental r USING(inventory_id)
    GROUP BY f.film_id, f.title
    HAVING COUNT(f.film_id) > (
        SELECT AVG(counts)
        FROM (
            SELECT COUNT(r.rental_id) as counts
            FROM inventory i
            INNER JOIN rental r USING (inventory_id)
            GROUP BY i.film_id
        )
    );  
    
    --PREFERRED SOLUTION
    WITH film_rental_counts AS (
        SELECT f.film_id, f.title, COUNT(r.rental_id) rental_count
        FROM film f
        INNER JOIN inventory i USING(film_id)
        INNER JOIN rental r USING(inventory_id)
        GROUP BY f.film_id
    ), 
    average_rentals AS (
        SELECT AVG(rental_count) as average FROM film_rental_counts
    )
    SELECT title, rental_count
    FROM film_rental_counts
    WHERE rental_count > (SELECT average FROM average_rentals);

/*
    Challenge 6.
    Write a SQL query that calculates rental activity for each customer.
    - The query should return the customer's first_name and last_name
    - It should also return their first rental date as first_rental
    - Their most recent rental date should be shown as last_rental
    - The difference in days between the first and last rentals should be shown as rental_span_days
    - Results should be grouped by customer and ordered by rental_span_days in descending order
*/

-- your query here

    SELECT c.first_name, c.last_name, MIN(r.rental_date) AS first_rental, MAX(r.rental_date) AS last_rental, 
    (EXTRACT(EPOCH FROM (MAX(r.rental_date) - MIN(r.rental_date))) / 86400)::int AS rental_span_days
    FROM customer c
    LEFT JOIN rental r USING(customer_id)
    GROUP BY c.customer_id, c.first_name, c.last_name
    ORDER BY rental_span_days DESC;


/*
    Challenge 7.
    Find all customers who have not rented movies from every available genre.
    - The result should include the customer's first_name and last_name
    - Only include customers who are missing at least one genre in their rental history
*/


-- your query here

    SELECT c.first_name, c.last_name
    FROM customer c
    WHERE (
        SELECT COUNT(DISTINCT fc.category_id)
        FROM rental r
        JOIN inventory i USING(inventory_id)
        JOIN film f USING(film_id)
        JOIN film_category fc USING(film_id)
        WHERE r.customer_id = c.customer_id
    ) != (SELECT COUNT(category_id) from category);

    --PREFERRED SOLUTION
    WITH customer_categories AS (
        SELECT r.customer_id, COUNT(DISTINCT fc.category_id) as categories_count
        FROM rental r
        JOIN inventory i USING(inventory_id)
        JOIN film f USING(film_id)
        JOIN film_category fc USING(film_id)
        GROUP BY r.customer_id
    )
    SELECT c.first_name, c.last_name
    FROM customer c
    INNER JOIN customer_categories cc USING(customer_id) 
    WHERE cc.categories_count != (SELECT COUNT(category_id) from category);

/*
    Challenge 8.
    Create a materialized view that summarizes total rental revenue per film category.

    First, write a SQL query that returns the category name and the total revenue generated by rentals in that category.

    Use the following tables: payment, rental, inventory, film, film_category, and category.

    - Group the results by category name and order them by total revenue (descending).
    - Then, turn your query into a materialized view named revenue_by_category.
    - Query the materialized view to return:
    - All categories and their total revenue.
    - The top 3 categories by revenue.
    - Finally, refresh the materialized view manually using SQL.

    Once you finish the exercise, please answer the following questions: 
    
    When would you prefer a materialized view over a regular view? 
    How often should it be refreshed?
*/

--Answer 1: I would prefer it in systems where read performance is critical and the underlying data does not change frequently. It is  especially useful when the query involves complex calculations or multiple joins (like this one with 6 tables) that would be too expensive to do in real-time every time the view is accessed
--Answer 2: It would depend on the use case, the data change rate, and resource availability. For example, for a management report, a daily refresh during off-peak hours might be enough, but for a sales dashboard, you might need to refresh it every few hours to keep the information useful without slowing down the db

-- your work here

    --PREFERRED SOLUTION
    CREATE MATERIALIZED VIEW revenue_by_category
    AS
    WITH metrics AS (
        SELECT fc.category_id, SUM(p.amount) as revenue
        FROM payment p
        INNER JOIN rental r USING(rental_id)
        INNER JOIN inventory i USING(inventory_id)
        INNER JOIN film f USING(film_id)
        INNER JOIN film_category fc USING(film_id)
        GROUP BY fc.category_id
    )
    SELECT c.name, COALESCE(metrics.revenue, 0) as total_revenue
    FROM category c
    LEFT JOIN metrics USING(category_id)
    ORDER BY total_revenue DESC;

    --All the categories 
    SELECT * FROM revenue_by_category;

    --Top 3 
    SELECT * FROM revenue_by_category LIMIT 3;

    --Refreshing manually
    REFRESH MATERIALIZED VIEW revenue_by_category;


    --using subqueries
    CREATE MATERIALIZED VIEW revenue_by_category
    AS
    SELECT c.name, COALESCE(metrics.revenue, 0) as total_revenue
    FROM category c
    LEFT JOIN (
        SELECT fc.category_id, SUM(p.amount) as revenue
        FROM payment p
        INNER JOIN rental r USING(rental_id)
        INNER JOIN inventory i USING(inventory_id)
        INNER JOIN film f USING(film_id)
        INNER JOIN film_category fc USING(film_id)
        GROUP BY fc.category_id
    ) as metrics
    ON c.category_id = metrics.category_id
    ORDER BY total_revenue DESC;