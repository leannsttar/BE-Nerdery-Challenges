    /*
        Challenge: Implement a Secure Fund Transfer Function

        In this challenge, you will implement a PostgreSQL stored function to simulate transferring funds 
        between two accounts in a banking system. The function must follow proper validation, ensure data 
        integrity, and log transactions with a shared reference.

        Your function should be named:
        banking.transfer_funds(from_id INT, to_id INT, amount NUMERIC)

        The function must:

        - Prevent transfers to the same account
        - Ensure the transfer amount is greater than zero
        - Validate that both sender and recipient accounts exist
        - Prevent transfers if either account is marked as "frozen"
        - Ensure the sender has sufficient funds
        - Debit the sender and credit the recipient atomically
        - Log two transactions: a withdrawal and a deposit, both linked by the same UUID reference
        - Raise meaningful exceptions for all validation failures

        The function should perform all operations within a safe transactional context, maintaining 
        database consistency even in the event of failure.

        Notes:
        - In order to test you can mock some additional data in the tables that participates in this challenge.
        - Make sure of raising errors when they're present

        ERD:
        +---------------------+            +--------------------------+
        |     accounts        |            |      transactions        |
        +---------------------+            +--------------------------+
        | account_id (PK)     |<-----------| transaction_id (PK)      |
        | balance             |            | account_id (FK)          |
        | status              |            | amount                   |
        +---------------------+            | transaction_type         |
                                        | reference                |
                                        | transaction_date         |
                                        +--------------------------+
    */


    -- your solution here

    CREATE OR REPLACE FUNCTION banking.transfer_funds(from_id int, to_id int, amount numeric)
    RETURNS uuid
    AS
    $$
    DECLARE linked_reference uuid;
            sender_status text;
            receiver_status text;
            sender_balance numeric;
    BEGIN
        SELECT gen_random_uuid() INTO linked_reference;

        --Basic validations
        IF from_id = to_id THEN
            RAISE EXCEPTION 'Cannot transfer to the same account';
        END IF;

        IF amount <= 0 THEN
            RAISE EXCEPTION 'Transfer amount must be positive';
        END IF;

        --Fetching the sender, locking the row and validating
        SELECT status, balance INTO sender_status, sender_balance
        FROM banking.accounts WHERE account_id = from_id FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Sender account % does not exist', from_id;
        END IF;

        IF sender_status = 'frozen' THEN
            RAISE EXCEPTION 'Sender account % is frozen', from_id;
        END IF;

        IF sender_balance < amount THEN
            RAISE EXCEPTION 'Insufficient funds';
        END IF;

        --Fetching the receiver, locking the row and validating
        SELECT STATUS INTO receiver_status
        FROM banking.accounts WHERE account_id = to_id FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Receiver account % doesnt exist', to_id;
        END IF;

        IF receiver_status = 'frozen' THEN
            RAISE EXCEPTION 'Receiver account % is frozen', to_id;
        END IF;

        --Debit the sender and credit the recipient
        UPDATE banking.accounts SET balance = balance + amount WHERE account_id = to_id;
        UPDATE banking.accounts SET balance = balance - amount WHERE account_id = from_id;

        --log in banking.transactions
        INSERT INTO banking.transactions (account_id, amount, transaction_type, reference, transaction_date) VALUES 
        (from_id, amount, 'withdrawal', linked_reference, now()),
        (to_id, amount, 'deposit', linked_reference, now());

        RETURN linked_reference;
    END;
    $$
    LANGUAGE PLPGSQL;

    SELECT banking.transfer_funds(1, 2, 100);