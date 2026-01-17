"use client";

import * as React from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer = ({ open, onClose, children }: DrawerProps) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 transition-opacity"
        style={{ backgroundColor: 'rgba(26, 26, 26, 0.4)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl">
        <div className="animate-in slide-in-from-bottom-4 duration-300">
          <div
            className="mx-4 mb-6 overflow-hidden rounded-2xl shadow-2xl"
            style={{ backgroundColor: '#fefefa', border: '1px solid #e8e4dc' }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export { Drawer };
