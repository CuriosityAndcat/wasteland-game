import React, { useState } from 'react';

interface NameInputProps {
  title: string;
  defaultName: string;
  onConfirm: (name: string) => void;
  onCancel?: () => void;
}

const NameInput: React.FC<NameInputProps> = ({ title, defaultName, onConfirm, onCancel }) => {
  const [name, setName] = useState(defaultName);

  const handleConfirm = () => {
    const finalName = name.trim() || defaultName;
    onConfirm(finalName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gray-900 border-2 border-yellow-500 rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <h2 className="text-yellow-400 font-bold text-lg text-center mb-4">{title}</h2>
        
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value.slice(0, 8))}
          maxLength={8}
          autoFocus
          className="w-full bg-gray-800 border-2 border-gray-600 rounded-lg px-4 py-3 text-white text-lg text-center font-bold outline-none focus:border-yellow-500 transition-all"
          onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
        />
        
        <p className="text-gray-500 text-xs text-center mt-2">最多8个字符，按回车确认</p>
        
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-green-700 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg border-b-2 border-green-900 transition-all text-sm"
          >
            确定
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 rounded-lg border-b-2 border-gray-900 transition-all text-sm"
            >
              跳过
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameInput;