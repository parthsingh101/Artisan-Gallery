import mongoose, { Schema, models } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    passwordHash: {
      type:     String,
      required: [true, "Password is required"],
      minlength: 6,
      select:   false,
    },
    role: {
      type:    String,
      enum:    ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: null,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref:  "Product",
      },
    ],
    cart: [
      {
        cartItemId: String,
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        title:      String,
        artistName: String,
        price:      Number,
        image:      String,
        quantity:   { type: Number, default: 1 },
        variant: {
          size:     String,
          frame:    String,
          material: String,
          extraPrice: { type: Number, default: 0 },
        },
      },
    ],
    address: {
      fullName:   String,
      street:     String,
      city:       String,
      state:      String,
      postalCode: String,
      country:    { type: String, default: "India" },
      phone:      String,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};


const User = models.User || mongoose.model("User", UserSchema);
export default User;
