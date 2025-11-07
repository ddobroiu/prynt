"use client";
import React from "react";

type Props = {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  width: number;
  height: number;
  onWidthChange: (n: number) => void;
  onHeightChange: (n: number) => void;
};

export default function DimensionEditor({ minWidth=10, maxWidth=500, minHeight=10, maxHeight=300, width, height, onWidthChange, onHeightChange }: Props) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label>Lățime (cm)</label>
      <input
        type="number"
        value={width}
        min={minWidth}
        max={maxWidth}
        onChange={(e) => onWidthChange(Number(e.target.value))}
        style={{ width: 120, marginLeft: 8 }}
      />
      <label style={{ marginLeft: 16 }}>Înălțime (cm)</label>
      <input
        type="number"
        value={height}
        min={minHeight}
        max={maxHeight}
        onChange={(e) => onHeightChange(Number(e.target.value))}
        style={{ width: 120, marginLeft: 8 }}
      />
    </div>
  );
}