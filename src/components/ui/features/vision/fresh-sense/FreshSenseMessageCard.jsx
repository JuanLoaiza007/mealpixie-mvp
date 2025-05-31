// components/ui/features/vision/fresh-sense/FreshSenseMessageCard.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

/**
 * Displays a styled card containing a result message.
 *
 * @component
 *
 * @param {string} message - The message to display inside the card. Required.
 *
 * @remarks
 * This is a stateless functional component that renders a Card using the Card, CardHeader, CardTitle, and CardContent components. It has no side effects or hooks.
 *
 * @returns {JSX.Element} A Card component rendering the provided message.
 *
 * @example
 * ```jsx
 * import { FreshSenseMessageCard } from '@/components/ui/features/vision/fresh-sense/FreshSenseMessageCard';
 *
 * function App() {
 *   return (
 *     <FreshSenseMessageCard message="This is a sample result message." />
 *   );
 * }
 * ```
 */
export function FreshSenseMessageCard({ message }) {
  return (
    <Card className="border-gray-300 w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle>Resultado</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{message}</p>
      </CardContent>
    </Card>
  );
}
