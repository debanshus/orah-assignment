const fs = require('fs');

let content = fs.readFileSync('src/pages/Triggers.tsx', 'utf-8');

// 1. Add useRef and useEffect for clicking outside
if (!content.includes('useRef')) {
  content = content.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect, useRef } from 'react';");
}

const dropdownLogic = `
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowRecipientsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
`;
content = content.replace('// Dropdown states for recipients multi-select (simple version)\n  const [showRecipientsDropdown, setShowRecipientsDropdown] = useState(false);', '// Dropdown states for recipients multi-select (simple version)\n  const [showRecipientsDropdown, setShowRecipientsDropdown] = useState(false);\n' + dropdownLogic);


// 2. Add resetForm function
const resetFormFn = `
  const resetForm = () => {
    setClassId('any');
    setAbsentCount('');
    setAbsentType(AbsentCriteria.CONSECUTIVE);
    setWithinCount('');
    setWithinUnit('days');
    setAlertFrequency(CriteriaMetFrequency.ONCE);
    setRecipients([]);
    setTimingType(TriggerSchedule.IMMEDIATELY);
    setDelayedHours('');
    setScheduledTime('');
  };
`;
content = content.replace('const handleCreate = async () => {', resetFormFn + '\n  const handleCreate = async () => {');

// 3. Apply resetForm on successModal close
content = content.replace('onClose={() => setSuccessModal(false)}', 'onClose={() => { setSuccessModal(false); resetForm(); }}');

// 4. Attach ref to dropdown
content = content.replace('<div className="relative inline-block mx-2">', '<div className="relative inline-block mx-2" ref={dropdownRef}>');

fs.writeFileSync('src/pages/Triggers.tsx', content);
