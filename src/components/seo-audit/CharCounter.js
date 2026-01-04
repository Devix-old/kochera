'use client';

export default function CharCounter({ value, min, max, label }) {
  const length = value?.length || 0;
  const isValid = length >= min && length <= max;
  
  let statusColor = 'text-gray-600';
  let bgColor = 'bg-gray-50';
  
  if (!value || value.length === 0) {
    statusColor = 'text-red-600';
    bgColor = 'bg-red-50';
  } else if (length < min || length > max) {
    // Invalid: too short or too long
    statusColor = 'text-red-600';
    bgColor = 'bg-red-50';
  } else {
    // Valid: within range - show normal gray color
    statusColor = 'text-gray-600';
    bgColor = 'bg-gray-50';
  }
  
  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${bgColor}`}>
      <span className="text-sm font-medium">{label}:</span>
      <span className={`text-sm font-bold ${statusColor}`}>
        {length} / {min}-{max}
      </span>
      {!isValid && value && (
        <span className="text-xs text-red-600">
          {length < min ? `+${min - length} needed` : `-${length - max} over`}
        </span>
      )}
    </div>
  );
}

