import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema(
  {
    promotionNm: String,
    promotionStart: Date,
    promotionEnd: Date,
    promotionDesc: String,
    ImageID: Number,
    serviceID: [Number],
    branchID: [Number],
    promoCode: String,
    discountAm: mongoose.Decimal128,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Promotion", PromotionSchema);
