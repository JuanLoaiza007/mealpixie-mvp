// components/ui/features/vision/fresh-sense/FreshSenseResultItem.jsx
import React from 'react';

/**
 * Displays a result item with its label, assessment text, and an associated icon.
 *
 * @component
 *
 * @param {string} item - The label or name of the result item. Required.
 * @param {string} assessment - The assessment or description associated with the item. Required.
 * @param {React.ReactNode} icon - The icon representing the item, typically a React element. Required.
 *
 * @remarks
 * This is a purely presentational component and does not use any hooks or cause side effects.
 *
 * @returns {JSX.Element} A styled container showing the item label, assessment, and icon.
 *
 * @example
 * import React from 'react';
 * import { FreshSenseResultItem } from 'components/ui/features/vision/fresh-sense/FreshSenseResultItem';
 * import { FaThermometerHalf } from 'react-icons/fa';
 *
 * function ResultsExample() {
 *   return (
 *     <FreshSenseResultItem
 *       item="Temperature"
 *       assessment="Within normal range"
 *       icon={<FaThermometerHalf />}
 *     />
 *   );
 * }
 */
export function FreshSenseResultItem({ item, assessment, icon }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 rounded-lg p-4">
      <div className="flex-1">
        <h4 className="text-base font-semibold text-orange-500 mb-1">
          {item}
        </h4>
        <p className="text-sm text-gray-700">{assessment}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
