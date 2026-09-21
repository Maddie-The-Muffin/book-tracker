# Still to do:
[ ] Fix bug on reflection page where "would recommend" resets to default on save (visual bug only)
[ ] When a user finishes a book, prompt them to go through the reflection (At the very least, a little popup that takes you to the reflection; ideally a modal popup with the reflection questions, all skippable (and pressing 'X' counts as skipping it as well))
[ ] Responsive design for small screens
[ ] Accessibility considerations (aria labels, reduced motion, etc)
[ ] Share card on finish book (share to twitter, facebook, native mobile - things like the book's title, author, rating, notes?)

# Completed:
[X] Add loading spinner for book search page
[X] Save changes should go back to shelf page on success (w success popup).
[X] If saving changes failed (because of internet or other reason) it should remain on the edit page with a dialog saying changes failed to update
[X] Disallow users from clicking "add" multiple times while the operation is processing (to prevent duplicates)
[X] Add extra questions for people who have finished reading a book to make them think deeper about what they've read (e.g. favorite part, least favorite character)