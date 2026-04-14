import { Schema, model, Types } from 'mongoose';

// ─── 1. Constants ─────────────────────────────────────────────────────────────

export const RESOURCE_TYPES = ['manual', 'video', 'noticia'] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

// ─── 2. Sub-interface ─────────────────────────────────────────────────────────

export interface IResourceItem {
    url:         string;
    type:        ResourceType;
    description: string;
}

// ─── 3. Root interface ────────────────────────────────────────────────────────

export interface IResource {
    _id?:          Types.ObjectId;
    restaurant_id: Types.ObjectId;   // reference to Restaurant
    items:         IResourceItem[];  // vector of resource objects
}

// ─── 4. Sub-schema ────────────────────────────────────────────────────────────

const resourceItemSchema = new Schema<IResourceItem>(
    {
        url: {
            type:     String,
            required: [true, 'url is required'],
            trim:     true,
            validate: {
                validator: (v: string) => /^https?:\/\/.+/.test(v),
                message:   (p: { value: string }) => `"${p.value}" is not a valid URL.`,
            },
        },
        type: {
            type:     String,
            enum:     RESOURCE_TYPES,
            required: [true, 'type is required'],
        },
        description: {
            type:      String,
            required:  [true, 'description is required'],
            trim:      true,
            maxlength: [500, 'description must be at most 500 characters.'],
        },
    },
    { _id: true }
);

// ─── 5. Root schema ───────────────────────────────────────────────────────────

const resourceSchema = new Schema<IResource>(
    {
        restaurant_id: {
            type:     Schema.Types.ObjectId,
            ref:      'Restaurant',
            required: [true, 'restaurant_id is required'],
        },
        items: {
            type:    [resourceItemSchema],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ─── 6. Indexes ───────────────────────────────────────────────────────────────

resourceSchema.index({ restaurant_id: 1 }, { unique: true }); // one doc per restaurant

// ─── 7. Pre-save – validate restaurant exists ─────────────────────────────────

resourceSchema.pre('save', async function (next) {
    try {
        if (this.isModified('restaurant_id') || this.isNew) {
            const { RestaurantModel } = await import('./restaurant');
            const restaurantExists = await RestaurantModel.exists({ _id: this.restaurant_id });
            if (!restaurantExists) {
                return next(new Error(`Restaurant with id ${this.restaurant_id} does not exist`));
            }
        }
        next();
    } catch (err: any) {
        next(err);
    }
});

// ─── 8. Model ─────────────────────────────────────────────────────────────────

export const ResourceModel = model<IResource>('Resource', resourceSchema);
