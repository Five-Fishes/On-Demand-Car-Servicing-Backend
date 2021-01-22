import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema(
  {
    promotionNm: String,
    promotionStart: Date,
    promotionEnd: Date,
    promotionDesc: String,
    image: {
      _id: String,
      imageSize: mongoose.Decimal128,
      imageURL: String,
      imageFileNm: String,
      imageType: String,
    },
    promotionService: [
      {
        _id: String,
        serviceNm: String,
        isDispatchAvailable: Boolean,
        isInHouseAvailable: Boolean,
        estimatedServiceTime: mongoose.Decimal128,
      },
    ],
    promotionBranch: [
      {
        _id: String,
        branchAddr: String,
        branchContactNo: String,
      },
    ],
    promoCode: String,
    discountAmt: mongoose.Decimal128,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Promotion", PromotionSchema);
