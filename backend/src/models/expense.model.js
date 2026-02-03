import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
      validate: {
        validator: function(value) {
          // Ensure amount has at most 2 decimal places
          return /^\d+(\.\d{1,2})?$/.test(value.toString());
        },
        message: 'Amount must have at most 2 decimal places'
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      minlength: [1, 'Category cannot be empty'],
      maxlength: [50, 'Category cannot exceed 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [1, 'Description cannot be empty'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      validate: {
        validator: function(value) {
          // Ensure date is not in the future
          return value <= new Date();
        },
        message: 'Date cannot be in the future'
      }
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false
  }
);

// Add indexes for efficient querying
expenseSchema.index({ category: 1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ createdAt: -1 });

// Virtual for id (if you want to use id instead of _id in responses)
expenseSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtuals are included when converting to JSON
expenseSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
