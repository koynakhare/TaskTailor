import mongoose, { Schema, Document } from "mongoose";

export interface IDestination extends Document {
  name: string;
  location: { type: "Point"; coordinates: [number, number] };
  country: string;
  avgCost?: number;
}

const DestinationSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }
  },
  country: { type: String, required: true },
  avgCost: { type: Number }
});

DestinationSchema.index({ location: "2dsphere" });

export default mongoose.models.Destination || mongoose.model<IDestination>("Destination", DestinationSchema);
