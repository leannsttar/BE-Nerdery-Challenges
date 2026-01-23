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

    create or replace function banking.transfer_funds(from_id int, to_id int, amount numeric)
    returns uuid
    as
    $$
    declare linked_reference uuid;
            sender_status text;
            receiver_status text;
            sender_balance numeric;
    begin
        select gen_random_uuid() into linked_reference;

        --Basic validations
        if from_id = to_id then
            raise exception 'Cannot transfer to the same account';
        end if;

        if amount <= 0 then
            raise exception 'Transfer amount must be positive';
        end if;

        --Fetching the sender, locking the row and validating
        select status, balance into sender_status, sender_balance
        from banking.accounts where account_id = from_id for update;

        if not found then
            raise exception 'Sender account % does not exist', from_id;
        end if;

        if sender_status = 'frozen' then
            raise exception 'Sender account % is frozen', from_id;
        end if;

        if sender_balance < amount then
            raise exception 'Insufficient funds';
        end if;

        --Fetching the receiver, locking the row and validating
        select status into receiver_status
        from banking.accounts where account_id = to_id for update;

        if not found then
            raise exception 'Receiver account % doesnt exist', to_id;
        end if;

        if receiver_status = 'frozen' then
            raise exception 'Receiver account % is frozen', to_id;
        end if;

        --Debit the sender and credit the recipient
        update banking.accounts set balance = balance + amount where account_id = to_id;
        update banking.accounts set balance = balance - amount where account_id = from_id;

        --log in banking.transactions
        insert into banking.transactions (account_id, amount, transaction_type, reference, transaction_date) values 
        (from_id, amount, 'withdrawal', linked_reference, now()),
        (to_id, amount, 'deposit', linked_reference, now());

        return linked_reference;
    end;
    $$
    language plpgsql;

    SELECT banking.transfer_funds(1, 2, 100);