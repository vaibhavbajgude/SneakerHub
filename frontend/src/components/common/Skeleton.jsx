import React from 'react';

const Skeleton = ({ className, variant = 'rect' }) => {
    const baseClass = "animate-pulse bg-gray-200";

    const variantClasses = {
        rect: "rounded-lg",
        circle: "rounded-full",
        text: "rounded h-4 w-full"
    };

    return (
        <div className={`${baseClass} ${variantClasses[variant]} ${className}`}></div>
    );
};

export const ProductSkeleton = () => (
    <div className="card h-full">
        <Skeleton className="aspect-square rounded-t-2xl" />
        <div className="p-4 space-y-3">
            <Skeleton variant="text" className="w-2/3" />
            <Skeleton variant="text" className="w-1/2" />
            <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8" variant="circle" />
            </div>
        </div>
    </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4 }) => (
    <div className="space-y-4">
        {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex gap-4">
                {[...Array(cols)].map((_, j) => (
                    <Skeleton key={j} className="h-10 flex-1" />
                ))}
            </div>
        ))}
    </div>
);

export default Skeleton;
