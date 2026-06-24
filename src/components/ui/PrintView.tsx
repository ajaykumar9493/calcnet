interface PrintViewProps {
  children: React.ReactNode;
}

export function PrintView({ children }: PrintViewProps) {
  return (
    <div className="print-view print:block">
      <style jsx global>{`
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          .print-view { display: block !important; }
          body { background: white !important; color: black !important; }
        }
      `}</style>
      {children}
    </div>
  );
}
