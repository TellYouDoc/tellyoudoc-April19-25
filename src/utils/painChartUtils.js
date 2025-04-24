// Direct replacement for getPainColor function in PatientProfile.jsx
// This ensures proper color mapping for pain levels

// Function to get color based on pain level
const getPainColor = (level) => {
  // Convert level to a number (in case it's a string)
  const painLevel = Number(level);
  
  // Simple if statements instead of switch for better clarity
  if (painLevel === 0) return '#4ade80'; // No pain - green
  if (painLevel === 1) return '#a3e635'; // Very mild - light green
  if (painLevel === 2) return '#facc15'; // Mild - yellow
  if (painLevel === 3) return '#fb923c'; // Moderate - orange
  if (painLevel === 4) return '#f87171'; // Severe - light red
  if (painLevel === 5) return '#ef4444'; // Very severe - red
  
  // Default case
  return '#4ade80';
};

// Use this function in your renderPainChart function's shape rendering:
/*
shape={(props) => {
  // Get the pain value for the current bar
  const painValue = Number(props.payload[dataKey]);
  // Check if it's a period day
  const isPeriodDay = props.payload.periodDay;
  
  // Only use red for period days with pain, otherwise use the appropriate color for the pain level
  let barColor;
  if (isPeriodDay && painValue > 0) {
    barColor = "#FF0000"; // Red for period days with pain
  } else {
    barColor = getPainColor(painValue); // Normal pain color scale
  }
  
  return <rect
    x={props.x}
    y={props.y}
    width={props.width}
    height={props.height}
    fill={barColor}
    radius={[0, 0, 0, 0]}
  />;
}}
*/
