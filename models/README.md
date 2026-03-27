# Models Directory

This directory contains Mongoose models for the application.

## Best Practices
- Every model should use the `models.ModelName || model(...)` pattern to prevent re-definition errors during Next.js hot reloads.
- Use singular naming (e.g., `User.js`, `Product.js`).
- Enable `{ timestamps: true }` in all schemas.

## Current Models
- `User.js`
- `Product.js`
- `Category.js`
- `Order.js`
- `Review.js`
