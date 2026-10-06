# Still to do:
[ ] See if changing from email/password to username/password is worth it
[ ] Privacy policy
[ ] Auth tests
[ ] check to make sure no attacks can be done via book search bar
[ ] Account deletion
[ ] Sign-up rate limits

# Completed:
[X] Share card on finish book (share to twitter, facebook, native mobile - things like the book's title, author, rating, notes?)
[X] Add loading spinner for book search page
[X] Save changes should go back to shelf page on success (w success popup).
[X] If saving changes failed (because of internet or other reason) it should remain on the edit page with a dialog saying changes failed to update
[X] Disallow users from clicking "add" multiple times while the operation is processing (to prevent duplicates)
[X] Add extra questions for people who have finished reading a book to make them think deeper about what they've read (e.g. favorite part, least favorite character)
[X] When a user finishes a book, prompt them to go through the reflection (At the very least, a little popup that takes you to the reflection; ideally a modal popup with the reflection questions, all skippable (and pressing 'X' counts as skipping it as well))
[X] Fix bug on reflection page where "would recommend" resets to default on save (visual bug only)
    - (developer's note: reflection questions now redirect to shelf on save so this is now moot)
[X] Responsive design for small screens
[X] Accessibility considerations (aria labels, reduced motion, etc)
[X] 404 page
[X] Footer