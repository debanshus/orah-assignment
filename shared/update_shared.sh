sed -i '' 's/triggerDetails: string;/triggerDetails: string;\n  emailLogs?: { to_address: string; subject: string; body: string; sent_at: string; }[];/' src/index.ts
npm run build
