# Identified Gaps — UHL People Portal Alpha

## Content Gaps

1. **Handbook Section 45 (State Addendums)**: The handbook references 10 state addendums (AZ, FL, GA, KY, MA, MD, NC, NY, OH, TN) but the current structured content may not fully cover every state-specific provision. Should be reviewed by Ryan against the source PDF.

2. **Performance Review Memo**: The `15Five_Performance_Review_Memo_v2.docx` file exists in the data folder but its content is not currently surfaced in the portal. Consider adding a performance reviews section or linking from the handbook.

3. **Offer Letter Templates**: The offer letter templates (sales and non-sales) are in the data folder but only accessible to admins. Employees cannot view their own offer letter template — this is intentional per the confidentiality constraints.

## Functional Gaps

4. **Document Upload Storage**: The admin document upload currently uses a placeholder file URL. Needs Vercel Blob integration with `BLOB_READ_WRITE_TOKEN` configured to enable actual file storage and retrieval.

5. **Admin user emails**: The seed file assumes `ryan@usahomelistings.com` and `eric@usahomelistings.com`. These need to be verified as the exact Google Workspace email addresses.

6. **Manager Role**: No employees are currently seeded with the "manager" role. Ryan should identify which employees should have manager access (if different from admin).

## Data Gaps

7. **Benefits Effective Date Logic**: The portal shows "Benefits effective May 1, 2026" as a static banner. After that date, this should be removed or updated.

8. **401(k) Profit Sharing**: The profit sharing contribution is listed as "discretionary" — there's no specific percentage or amount to display. This is correct per the plan design but employees may ask for more detail.

9. **Commission/Bonus Details**: Commission and bonus plan details are referenced in the handbook but are not rendered as separate portal sections (they're in the data/ folder documents). These could be added as downloadable documents in the document library.

## Security Notes

10. **Anonymous Report Verification**: The report submission endpoint does not log any identifying information. Verified: no user ID, no IP, no session token in the database record. The `reportDate` stores only the date (not timestamp) to prevent timing-based identification.

11. **Labor Tracker**: The labor tracker XLSX contains salary data and is NOT exposed anywhere in the employee-facing portal. It is gitignored via `data/Labor*`.

## Future Enhancements (Post-Alpha)

- Email notifications when a report status changes
- Print-friendly handbook view
- Onboarding checklist integration with Monday.com
- Benefits enrollment deadline reminders
- Mobile app / PWA support
