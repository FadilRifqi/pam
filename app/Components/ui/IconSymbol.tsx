import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconSymbolProps = {
  name: string;
  size?: number;
  color?: string;
};

const IconSymbol = ({ name, size = 24, color = 'black' }: IconSymbolProps) => {
  return <Ionicons name={name as any} size={size} color={color} />;
};

export default IconSymbol;

