## Auto-emailer

Made with Python.

With a given **HTML template** and 1 blank for the person's name, replace all instances of `${PERSON_NAME}` with a value taken from a comma-delimited list.

For example, with a comma-delimited address file reading:
> name 1,email_one@example.com
> name 2,email_two@example.com

To expand to fill in multiple fields, change the `user_emails` function to read your comma-delimited text file, and update the loop and the zip to include all the variables you need. Remember to also update the substitution (see the [Python documentation on template strings](https://docs.python.org/2/library/string.html#template-strings) for more info).

To use a plain-text template instead of a HTML template, `Ctrl+F` (or `Cmd+F` if you are using a Mac) all instances of `HTML` in the code and replace it with `text`.

### To run: 

`python3 automail_upd.py` (Bash or Command Prompt)

### Security: 

Turn on "less secure apps" in your account/security settings if using Gmail. 

No passwords, login details or email contents are stored in this program.
