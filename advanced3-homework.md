# Advanced 3 Homework Tasks

## Timing
- Mandatory only after the Advanced 3 lecture.
- Submit no later than Thu 8.1.26.

## PR and Submission Rules
- Create a new PR for this homework with name: `advanced-3/forms`.
- Fix all review comments; PRs are reviewed once.
- Push branch and open PR; attach screenshots/GIFs in PR description.
- Submit via the homework form link: https://forms.office.com/r/83sMHrSG2F

## Required Form Tasks
1. Build a form with 10–15 fields using main control types:
   - Text input, checkbox, radio, range slider, select, textarea, plus other relevant types.
2. Include required fields:
   - Email
   - Password + confirm password
3. Implement validation using one library (React Hook Form + Zod or Formik + Yup); prefer `onBlur`.
4. Show validation errors to users.
5. Disable Submit when the form is invalid.
6. Ensure accessibility:
   - Proper labels and keyboard navigation.
   - Visible focus styles that do not shift layout.
7. On submit:
   - Simulate async request (fake delay).
   - Log submitted data to the console.
8. Cache non-sensitive data in `localStorage`; do NOT store passwords or sensitive fields.

## Bonus (Optional)
- Custom-styled radio buttons or checkboxes:
  - Hide native controls with a visually-hidden technique.
  - Keep fully accessible (keyboard and screen reader).

## Advanced Bonus (Optional)
- Animate validation errors appearing/disappearing without layout shift.
