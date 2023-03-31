1. "Unit" Tests: Unit of your application.

    ° Eg: A function to 'format dates';
    ° Eg: A function to 'send a document';

2. "Integration" tests: communication between 2 or more units.

    ° Eg: The 'show time' function communicates with the 'format dates' function;
    ° Eg: The 'share docs' function communicates with the 'send a document' function;

3. "e2e" tests: simulates a user performing various operations.

    ° Eg.: Front-End -> simulates a registration in the application
    ° Eg: Back-End -> simulates HTTP requests, WebSockets.

4. Test Pyramid:

    ° e2e -> Does not depend on technology, architecture, structure (entry barrier: LOW);
    ° Unitary -> Base of tests of application;
