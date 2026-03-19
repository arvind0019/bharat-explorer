import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simplified but representative state paths for SVG map
const STATES = [
  { id: 'jammu-kashmir', name: 'Jammu & Kashmir', d: 'M120,20 L175,15 L205,32 L208,65 L182,80 L158,72 L132,55 Z', cx: 165, cy: 48 },
  { id: 'ladakh', name: 'Ladakh', d: 'M175,15 L230,10 L255,32 L248,65 L208,65 L205,32 Z', cx: 215, cy: 38 },
  { id: 'himachal-pradesh', name: 'Himachal Pradesh', d: 'M158,72 L182,80 L208,65 L208,92 L190,108 L162,100 L150,84 Z', cx: 180, cy: 88 },
  { id: 'punjab', name: 'Punjab', d: 'M122,58 L158,72 L150,84 L140,106 L114,100 L100,82 L110,66 Z', cx: 130, cy: 82 },
  { id: 'uttarakhand', name: 'Uttarakhand', d: 'M190,108 L208,92 L225,96 L232,122 L208,128 L190,120 Z', cx: 210, cy: 112 },
  { id: 'haryana', name: 'Haryana', d: 'M114,100 L140,106 L150,84 L162,100 L162,120 L140,126 L114,120 Z', cx: 138, cy: 110 },
  { id: 'delhi', name: 'Delhi', d: 'M140,120 L158,116 L162,132 L144,136 Z', cx: 150, cy: 126 },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', d: 'M158,116 L232,122 L255,128 L268,158 L246,184 L202,184 L162,172 L144,136 Z', cx: 205, cy: 152 },
  { id: 'rajasthan', name: 'Rajasthan', d: 'M100,82 L114,100 L114,120 L140,126 L140,150 L120,172 L84,178 L62,155 L58,124 L74,98 Z', cx: 100, cy: 135 },
  { id: 'bihar', name: 'Bihar', d: 'M255,128 L292,122 L302,148 L286,174 L246,184 L268,158 Z', cx: 272, cy: 152 },
  { id: 'jharkhand', name: 'Jharkhand', d: 'M286,174 L302,148 L322,154 L328,182 L306,198 L278,192 Z', cx: 304, cy: 172 },
  { id: 'west-bengal', name: 'West Bengal', d: 'M302,148 L330,136 L348,162 L342,188 L322,202 L306,198 L328,182 Z', cx: 325, cy: 170 },
  { id: 'odisha', name: 'Odisha', d: 'M306,198 L342,188 L352,218 L336,244 L308,248 L288,226 L288,208 Z', cx: 318, cy: 220 },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh', d: 'M120,172 L162,172 L202,184 L246,184 L254,218 L232,244 L178,252 L138,244 L112,218 Z', cx: 185, cy: 212 },
  { id: 'gujarat', name: 'Gujarat', d: 'M58,155 L84,178 L84,208 L68,228 L42,222 L32,196 L38,168 Z', cx: 60, cy: 192 },
  { id: 'maharashtra', name: 'Maharashtra', d: 'M84,208 L112,218 L138,244 L138,274 L112,288 L84,278 L62,252 L58,228 L68,228 Z', cx: 100, cy: 248 },
  { id: 'chhattisgarh', name: 'Chhattisgarh', d: 'M246,184 L278,192 L288,208 L288,226 L272,252 L248,252 L232,244 L254,218 Z', cx: 262, cy: 220 },
  { id: 'telangana', name: 'Telangana', d: 'M198,278 L228,262 L258,272 L268,298 L246,318 L206,318 L186,298 Z', cx: 226, cy: 292 },
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', d: 'M228,262 L260,250 L280,228 L302,248 L318,272 L302,302 L276,318 L258,312 L268,298 L258,272 Z', cx: 270, cy: 278 },
  { id: 'karnataka', name: 'Karnataka', d: 'M138,274 L178,268 L198,278 L186,298 L166,322 L138,322 L112,308 L112,288 Z', cx: 155, cy: 296 },
  { id: 'goa', name: 'Goa', d: 'M106,292 L120,288 L124,306 L108,310 Z', cx: 115, cy: 298 },
  { id: 'kerala', name: 'Kerala', d: 'M138,322 L166,322 L172,348 L166,378 L148,394 L134,372 L128,346 Z', cx: 150, cy: 352 },
  { id: 'tamil-nadu', name: 'Tamil Nadu', d: 'M166,322 L206,318 L222,342 L216,374 L194,394 L172,392 L166,378 L172,348 Z', cx: 194, cy: 355 },
  { id: 'arunachal-pradesh', name: 'Arunachal Pradesh', d: 'M355,78 L392,72 L402,98 L378,108 L355,98 Z', cx: 378, cy: 90 },
  { id: 'assam', name: 'Assam', d: 'M330,136 L358,108 L378,108 L372,132 L360,148 L342,148 L330,136 Z', cx: 354, cy: 128 },
  { id: 'meghalaya', name: 'Meghalaya', d: 'M342,148 L360,148 L366,168 L348,174 L332,162 Z', cx: 349, cy: 161 },
  { id: 'manipur', name: 'Manipur', d: 'M368,158 L386,152 L392,172 L378,182 L362,172 Z', cx: 376, cy: 167 },
  { id: 'nagaland', name: 'Nagaland', d: 'M372,132 L392,126 L398,148 L386,152 L368,142 Z', cx: 383, cy: 139 },
  { id: 'tripura', name: 'Tripura', d: 'M348,174 L362,170 L365,190 L350,192 Z', cx: 355, cy: 182 },
  { id: 'mizoram', name: 'Mizoram', d: 'M362,172 L378,168 L382,192 L364,196 Z', cx: 371, cy: 182 },
  { id: 'sikkim', name: 'Sikkim', d: 'M316,110 L330,106 L334,120 L318,122 Z', cx: 323, cy: 115 },
  { id: 'andaman', name: 'A&N Islands', d: 'M355,355 L365,350 L368,370 L357,374 Z', cx: 360, cy: 361 },
  { id: 'lakshadweep', name: 'Lakshadweep', d: 'M62,328 L70,324 L72,342 L63,344 Z', cx: 67, cy: 333 },
  { id: 'chandigarh', name: 'Chandigarh', d: 'M136,94 L142,92 L144,100 L138,102 Z', cx: 140, cy: 97 },
  { id: 'puducherry', name: 'Puducherry', d: 'M210,362 L216,360 L218,370 L211,372 Z', cx: 213, cy: 366 },
];

const STATE_COLORS = [
  '#FFD580','#A8D8A8','#AED6F1','#F1948A','#C39BD3',
  '#76D7C4','#FAD7A0','#A9CCE3','#ABEBC6','#F9E79F',
  '#D2B4DE','#A3E4D7','#FAE5D3','#D5F5E3','#FDEBD0',
];

export default function IndiaMap({ onStateClick }) {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, name: '' });
  const navigate = useNavigate();

  const handleClick = (state) => {
    setSelectedState(state.id);
    if (onStateClick) onStateClick(state.name);
    else navigate(`/destinations?state=${encodeURIComponent(state.name)}`);
  };

  const handleMouseMove = (e, name) => {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    setTooltip({
      visible: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 35,
      name
    });
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 430 420"
        className="w-full h-auto max-h-[600px]"
        style={{ filter: 'drop-shadow(0 4px 16px rgba(255,107,53,0.1))' }}
      >
        {/* Ocean background */}
        <rect x="0" y="0" width="430" height="420" fill="#E8F4FD" rx="12" />

        {STATES.map((state, i) => {
          const isHovered = hoveredState === state.id;
          const isSelected = selectedState === state.id;
          const baseColor = STATE_COLORS[i % STATE_COLORS.length];

          return (
            <g key={state.id}>
              <path
                d={state.d}
                fill={isSelected ? '#FF6B35' : isHovered ? '#FF8C5A' : baseColor}
                stroke="white"
                strokeWidth={isSelected ? 2 : 1.5}
                strokeLinejoin="round"
                style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
                onMouseEnter={(e) => { setHoveredState(state.id); handleMouseMove(e, state.name); }}
                onMouseMove={(e) => handleMouseMove(e, state.name)}
                onMouseLeave={() => { setHoveredState(null); setTooltip({ ...tooltip, visible: false }); }}
                onClick={() => handleClick(state)}
              />
              {/* State label for larger states */}
              {state.name.length < 10 && (
                <text
                  x={state.cx}
                  y={state.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="5.5"
                  fontFamily="DM Sans, sans-serif"
                  fontWeight="500"
                  fill={isSelected ? 'white' : '#374151'}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  {state.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip.visible && (
          <g>
            <rect
              x={Math.min(tooltip.x - 50, 330)}
              y={tooltip.y - 10}
              width={tooltip.name.length * 6.5 + 16}
              height={26}
              rx={6}
              fill="#1A0A00"
              opacity={0.9}
            />
            <text
              x={Math.min(tooltip.x - 50, 330) + (tooltip.name.length * 6.5 + 16) / 2}
              y={tooltip.y + 3}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="8"
              fontFamily="DM Sans, sans-serif"
              fill="white"
              style={{ pointerEvents: 'none' }}
            >
              {tooltip.name}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
