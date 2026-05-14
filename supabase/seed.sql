-- APP 6 — ERP System: seed for 6 instances × 12 records = 72 rows.
-- Run AFTER schema.sql. Idempotent upsert on (instance_name, record_number).
-- Re-run to reset.
--
-- Today (in the demo): 2026-05-13. Every instance has ≥ 2 NON_COMPLIANT
-- records, and at least one OVERDUE record, so /api/status reports degraded.

insert into public.erp_records
  (instance_name, record_number, record_type, title, description,
   department, responsible_party,
   status, compliance_status,
   due_date, completed_date, financial_impact, notes)
values
  -- ─── Factory 1 ──────────────────────────────────────────────────────
  ('Factory 1','ERP-F1-001','SAFETY_CERTIFICATION','Q1 Safety Audit',                       'Quarterly internal audit per SOP-SAF-04.', 'Safety',           'Mike Torres','OVERDUE',       'NON_COMPLIANT','2026-04-30',NULL,        12500.00,'Required corrective actions not yet documented'),
  ('Factory 1','ERP-F1-002','REGULATORY',          'EPA Emissions Compliance Report',       'Title V air-emissions semiannual filing.', 'Legal',            'Sarah Chen', 'IN_REVIEW',     'UNDER_REVIEW', '2026-05-25',NULL,         8500.00,'Awaiting third-party measurement data'),
  ('Factory 1','ERP-F1-003','COMPLIANCE',          'ISO 9001 Recertification',              '3-year audit cycle preparation.',          'Quality Assurance','James Okafor','PENDING_REVIEW','COMPLIANT',    '2026-07-01',NULL,        24000.00,''),
  ('Factory 1','ERP-F1-004','REGULATORY',          'OSHA Inspection Readiness',             'Annual readiness checklist + walkthrough.','Safety',           'Mike Torres','APPROVED',      'COMPLIANT',    '2026-04-20','2026-04-18',    0.00,'Inspection passed without findings'),
  ('Factory 1','ERP-F1-005','FINANCIAL',           'Annual Financial Reconciliation',       'FY25 close + reconciliation packet.',      'Finance',          'David Park', 'IN_REVIEW',     'COMPLIANT',    '2026-06-30',NULL,       320000.00,''),
  ('Factory 1','ERP-F1-006','SAFETY_CERTIFICATION','Hazardous Materials Handling Cert',     'Annual HAZWOPER refresher cycle.',         'Safety',           'Mike Torres','APPROVED',      'COMPLIANT',    '2026-03-15','2026-03-12', 4500.00,''),
  ('Factory 1','ERP-F1-007','AUDIT',               'Q4 Internal Audit',                     'Operations + Finance scope.',              'Finance',          'David Park', 'PENDING_REVIEW','COMPLIANT',    '2026-06-15',NULL,            0.00,''),
  ('Factory 1','ERP-F1-008','COMPLIANCE',          'Vendor Risk Assessment',                'Tier-1 supplier annual review.',           'Legal',            'Sarah Chen', 'REJECTED',      'NON_COMPLIANT','2026-04-25',NULL,         5000.00,'Risk profile incomplete — returned to vendor'),
  ('Factory 1','ERP-F1-009','FINANCIAL',           'Equipment Depreciation Schedule',       'Annual GAAP schedule.',                    'Finance',          'David Park', 'APPROVED',      'COMPLIANT',    '2026-04-30','2026-04-28',185000.00,''),
  ('Factory 1','ERP-F1-010','FINANCIAL',           'Tax Filing Documentation',              'Federal + state corporate filings.',       'Finance',          'David Park', 'OVERDUE',       'UNDER_REVIEW', '2026-04-15',NULL,       425000.00,'Awaiting CPA sign-off'),
  ('Factory 1','ERP-F1-011','AUDIT',               'SOX Controls Testing',                  '404 control walkthrough + sampling.',      'Finance',          'Sarah Chen', 'PENDING_REVIEW','COMPLIANT',    '2026-06-20',NULL,        18000.00,''),
  ('Factory 1','ERP-F1-012','SAFETY_CERTIFICATION','Workplace Ergonomic Assessment',        'Pilot program — exempt from current cycle.','Operations',      'Mike Torres','OVERDUE',       'EXEMPT',       '2026-05-01',NULL,         2500.00,''),

  -- ─── Factory 2 ──────────────────────────────────────────────────────
  ('Factory 2','ERP-F2-001','SAFETY_CERTIFICATION','Annual Fire Safety Audit',              'NFPA 101 walkthrough + remediation list.', 'Safety',           'T. Roberts', 'OVERDUE',       'NON_COMPLIANT','2026-04-22',NULL,         8000.00,'Fire suppression system review pending'),
  ('Factory 2','ERP-F2-002','COMPLIANCE',          'Sarbanes-Oxley Compliance Review',      'Internal SOX review for FY26.',            'Finance',          'M. Lee',     'IN_REVIEW',     'COMPLIANT',    '2026-06-15',NULL,        25000.00,''),
  ('Factory 2','ERP-F2-003','AUDIT',               'Aerospace AS9100 Audit',                'Customer-driven audit.',                   'Quality Assurance','J. Watson',  'PENDING_REVIEW','UNDER_REVIEW', '2026-06-30',NULL,        35000.00,'Customer audit; preparation underway'),
  ('Factory 2','ERP-F2-004','REGULATORY',          'EPA Air Quality Report',                'Title V semiannual filing.',               'Legal',            'S. Holland', 'APPROVED',      'COMPLIANT',    '2026-04-30','2026-04-29', 6500.00,''),
  ('Factory 2','ERP-F2-005','FINANCIAL',           'Quarterly P&L Statement',               'Q2 FY26 statement.',                       'Finance',          'M. Lee',     'IN_REVIEW',     'COMPLIANT',    '2026-05-31',NULL,            0.00,''),
  ('Factory 2','ERP-F2-006','SAFETY_CERTIFICATION','Forklift Operator Certifications',      'Annual recertification batch.',            'Logistics',        'T. Roberts', 'PENDING_REVIEW','COMPLIANT',    '2026-06-10',NULL,         3500.00,''),
  ('Factory 2','ERP-F2-007','FINANCIAL',           'Cyber Liability Insurance Renewal',     '$5M policy renewal.',                      'Finance',          'M. Lee',     'OVERDUE',       'NON_COMPLIANT','2026-04-30',NULL,        78000.00,'Premium revision under negotiation'),
  ('Factory 2','ERP-F2-008','REGULATORY',          'ITAR Export Compliance Review',         'Annual licensing review.',                 'Legal',            'S. Holland', 'APPROVED',      'COMPLIANT',    '2026-04-10','2026-04-08',12000.00,''),
  ('Factory 2','ERP-F2-009','AUDIT',               'Internal Quality Audit Q2',             'Internal scope per QMS plan.',             'Quality Assurance','J. Watson',  'PENDING_REVIEW','COMPLIANT',    '2026-06-30',NULL,            0.00,''),
  ('Factory 2','ERP-F2-010','FINANCIAL',           'Mid-Year Tax Estimate',                 'Federal estimated payment.',               'Finance',          'M. Lee',     'APPROVED',      'COMPLIANT',    '2026-04-30','2026-04-25',220000.00,''),
  ('Factory 2','ERP-F2-011','COMPLIANCE',          'Confined Space Entry Permits',          'Quarterly permit template review.',        'Safety',           'T. Roberts', 'REJECTED',      'UNDER_REVIEW', '2026-05-05',NULL,         1500.00,'Permit template requires update'),
  ('Factory 2','ERP-F2-012','FINANCIAL',           'Defense Contracts Pricing Review',      'Sole-source contract pricing memo.',       'Finance',          'S. Holland', 'OVERDUE',       'EXEMPT',       '2026-04-25',NULL,       480000.00,'Sole-source exemption documented'),

  -- ─── Factory 3 — more non-compliance / older issues ─────────────────
  ('Factory 3','ERP-F3-001','AUDIT',               'ISO 14001 Environmental Audit',         'Recurring findings since Q4 still open.',  'Quality Assurance','R. Patel',   'OVERDUE',       'NON_COMPLIANT','2026-04-15',NULL,        18500.00,'Multiple findings open since Q4'),
  ('Factory 3','ERP-F3-002','REGULATORY',          'OSHA 300 Log Submission',               'Annual injury log filing.',                'Safety',           'Mike Torres','OVERDUE',       'NON_COMPLIANT','2026-02-28',NULL,            0.00,'Filing late; penalty risk'),
  ('Factory 3','ERP-F3-003','COMPLIANCE',          'RCRA Waste Management Compliance',      'Hazardous waste manifest review.',         'Legal',            'A. Kim',     'IN_REVIEW',     'UNDER_REVIEW', '2026-05-20',NULL,        22000.00,'Awaiting waste contractor docs'),
  ('Factory 3','ERP-F3-004','AUDIT',               'Equipment Maintenance Audit',           'Reliability + PM compliance review.',      'Operations',       'D. Wong',    'PENDING_REVIEW','COMPLIANT',    '2026-06-10',NULL,            0.00,''),
  ('Factory 3','ERP-F3-005','FINANCIAL',           'Annual Liability Insurance Policy',     '$10M general liability renewal.',          'Finance',          'C. Brown',   'APPROVED',      'COMPLIANT',    '2026-04-10','2026-04-09',145000.00,''),
  ('Factory 3','ERP-F3-006','SAFETY_CERTIFICATION','Hazmat Transportation Certification',   'Class 8 transport recert.',                'Logistics',        'A. Kim',     'PENDING_REVIEW','COMPLIANT',    '2026-06-25',NULL,         8500.00,''),
  ('Factory 3','ERP-F3-007','COMPLIANCE',          'Vendor Contract Renewals Q2',           'Top-10 vendor renewals.',                  'Legal',            'A. Kim',     'IN_REVIEW',     'COMPLIANT',    '2026-05-30',NULL,        65000.00,''),
  ('Factory 3','ERP-F3-008','FINANCIAL',           'Capital Equipment Depreciation',        'Annual GAAP schedule.',                    'Finance',          'C. Brown',   'APPROVED',      'COMPLIANT',    '2026-03-31','2026-03-30',380000.00,''),
  ('Factory 3','ERP-F3-009','COMPLIANCE',          'Safety Committee Minutes Filing',       'Q1 committee minutes binder.',             'Safety',           'Mike Torres','REJECTED',      'UNDER_REVIEW', '2026-05-05',NULL,            0.00,'Minutes incomplete'),
  ('Factory 3','ERP-F3-010','REGULATORY',          'EPA Stormwater Discharge Report',       'Quarterly outfall sampling report.',       'Legal',            'A. Kim',     'PENDING_REVIEW','COMPLIANT',    '2026-06-15',NULL,         4500.00,''),
  ('Factory 3','ERP-F3-011','FINANCIAL',           'Q1 Budget Variance Review',             'Plant-level variance analysis.',           'Finance',          'C. Brown',   'APPROVED',      'COMPLIANT',    '2026-04-30','2026-04-28',    0.00,''),
  ('Factory 3','ERP-F3-012','SAFETY_CERTIFICATION','Crane Operator Recertification',        'Operator on leave; exempt cycle.',         'Operations',       'D. Wong',    'OVERDUE',       'EXEMPT',       '2026-04-22',NULL,         2000.00,'Operator on extended leave — waiver granted'),

  -- ─── Factory 4 — financial-heavy ────────────────────────────────────
  ('Factory 4','ERP-F4-001','AUDIT',               'Q1 Production Cost Audit',              'Standard cost vs actuals reconciliation.', 'Finance',          'B. Yu',      'OVERDUE',       'NON_COMPLIANT','2026-04-30',NULL,       410000.00,'Variance analysis incomplete'),
  ('Factory 4','ERP-F4-002','AUDIT',               'Aerospace Quality System Audit',        'Customer surveillance audit.',             'Quality Assurance','J. Watson',  'IN_REVIEW',     'UNDER_REVIEW', '2026-05-25',NULL,        28000.00,''),
  ('Factory 4','ERP-F4-003','REGULATORY',          'Annual EPA Hazardous Waste Report',     'Annual hazardous-waste filing.',           'Legal',            'E. Sanders', 'APPROVED',      'COMPLIANT',    '2026-04-15','2026-04-14', 9500.00,''),
  ('Factory 4','ERP-F4-004','FINANCIAL',           'Insurance Premium Renewal',             'Property + casualty renewal.',             'Finance',          'B. Yu',      'IN_REVIEW',     'COMPLIANT',    '2026-06-01',NULL,        95000.00,''),
  ('Factory 4','ERP-F4-005','COMPLIANCE',          'Lockout/Tagout Procedure Compliance',   'Annual LOTO program audit.',               'Safety',           'Mike Torres','PENDING_REVIEW','COMPLIANT',    '2026-06-20',NULL,         1500.00,''),
  ('Factory 4','ERP-F4-006','SAFETY_CERTIFICATION','OSHA Voluntary Protection Program',     'VPP star reapplication packet.',           'Safety',           'Mike Torres','APPROVED',      'COMPLIANT',    '2026-03-20','2026-03-18', 5500.00,''),
  ('Factory 4','ERP-F4-007','FINANCIAL',           'Material Cost Variance Q1',             'Variance >5% requires explanation.',       'Finance',          'B. Yu',      'OVERDUE',       'NON_COMPLIANT','2026-04-25',NULL,       280000.00,'Discrepancy >5% — requires explanation'),
  ('Factory 4','ERP-F4-008','REGULATORY',          'Defense Production Act Compliance',     'DPA rated-order reporting.',               'Legal',            'E. Sanders', 'PENDING_REVIEW','COMPLIANT',    '2026-06-30',NULL,            0.00,''),
  ('Factory 4','ERP-F4-009','FINANCIAL',           'Capital Spending Approval Records',     'Annual capex packet.',                     'Finance',          'B. Yu',      'APPROVED',      'COMPLIANT',    '2026-04-30','2026-04-27',450000.00,''),
  ('Factory 4','ERP-F4-010','AUDIT',               'Internal Controls Audit',               'SOX 404 internal walkthrough.',            'Finance',          'E. Sanders', 'PENDING_REVIEW','COMPLIANT',    '2026-07-01',NULL,        32000.00,''),
  ('Factory 4','ERP-F4-011','SAFETY_CERTIFICATION','Pressure Vessel Inspection Cert',       'Annual ASME inspection.',                  'Operations',       'Mike Torres','REJECTED',      'UNDER_REVIEW', '2026-05-08',NULL,        12000.00,'Inspection report missing sections'),
  ('Factory 4','ERP-F4-012','REGULATORY',          'ITAR Annual Report',                    'Exempt this cycle — record only.',         'Legal',            'E. Sanders', 'PENDING_REVIEW','EXEMPT',       '2026-06-15',NULL,            0.00,''),

  -- ─── Warehouse 1 ────────────────────────────────────────────────────
  ('Warehouse 1','ERP-W1-001','AUDIT',               'OSHA Forklift Operator Training Audit', 'Annual operator records audit.',          'Safety',           'R. Allen',   'OVERDUE',       'NON_COMPLIANT','2026-04-20',NULL,         6500.00,'Two operators missing annual refresher'),
  ('Warehouse 1','ERP-W1-002','REGULATORY',          'DOT HazMat Transportation Compliance', 'Annual DOT review.',                       'Legal',            'K. Singh',   'IN_REVIEW',     'UNDER_REVIEW', '2026-05-22',NULL,        14500.00,''),
  ('Warehouse 1','ERP-W1-003','AUDIT',               'Inventory Accuracy Audit Q1',          'Cycle count variance analysis.',           'Operations',       'M. Davis',   'APPROVED',      'COMPLIANT',    '2026-04-25','2026-04-23',    0.00,''),
  ('Warehouse 1','ERP-W1-004','FINANCIAL',           'Annual Property Insurance',            'Building + contents renewal.',             'Finance',          'M. Davis',   'PENDING_REVIEW','COMPLIANT',    '2026-06-05',NULL,        86000.00,''),
  ('Warehouse 1','ERP-W1-005','SAFETY_CERTIFICATION','Fire Sprinkler System Certification',  'NFPA 25 annual test.',                     'Safety',           'R. Allen',   'APPROVED',      'COMPLIANT',    '2026-03-25','2026-03-22', 7800.00,''),
  ('Warehouse 1','ERP-W1-006','FINANCIAL',           'Q1 Operating Expenses Reconciliation', 'GL postings vs operating budget.',         'Finance',          'M. Davis',   'OVERDUE',       'NON_COMPLIANT','2026-04-30',NULL,       320000.00,'Multiple GL postings out of period'),
  ('Warehouse 1','ERP-W1-007','COMPLIANCE',          'SOC 2 Type II Audit Prep',             'WMS controls evidence packet.',            'Legal',            'K. Singh',   'PENDING_REVIEW','COMPLIANT',    '2026-06-30',NULL,        22000.00,''),
  ('Warehouse 1','ERP-W1-008','REGULATORY',          'EPA Air Permit Renewal',               'Permit-to-emit annual renewal.',           'Legal',            'K. Singh',   'APPROVED',      'COMPLIANT',    '2026-04-15','2026-04-12', 4500.00,''),
  ('Warehouse 1','ERP-W1-009','FINANCIAL',           'Annual Inventory Write-Off',           'Aged stock + obsolescence write-off.',     'Finance',          'M. Davis',   'IN_REVIEW',     'COMPLIANT',    '2026-05-31',NULL,        28000.00,''),
  ('Warehouse 1','ERP-W1-010','SAFETY_CERTIFICATION','Storage Tank Inspection',              'API 653 inspection.',                      'Operations',       'R. Allen',   'REJECTED',      'UNDER_REVIEW', '2026-05-04',NULL,         5500.00,'Inspector noted corrosion findings'),
  ('Warehouse 1','ERP-W1-011','AUDIT',               'Vendor Quality Audit',                 'Supplier scorecard audit.',                'Quality Assurance','M. Davis',   'PENDING_REVIEW','COMPLIANT',    '2026-06-22',NULL,            0.00,''),
  ('Warehouse 1','ERP-W1-012','COMPLIANCE',          'Building Code Compliance Check',       'Grandfathered structure exemption.',       'Operations',       'R. Allen',   'OVERDUE',       'EXEMPT',       '2026-04-28',NULL,            0.00,''),

  -- ─── Warehouse 2 ────────────────────────────────────────────────────
  ('Warehouse 2','ERP-W2-001','AUDIT',               'Refrigeration Compliance Audit',       'Cold-chain temperature log audit.',        'Operations',       'E. Adams',   'OVERDUE',       'NON_COMPLIANT','2026-04-22',NULL,        12500.00,'Temperature log gaps identified'),
  ('Warehouse 2','ERP-W2-002','REGULATORY',          'DOT Vehicle Inspection Records',       'Annual fleet inspection records.',         'Logistics',        'P. Nguyen',  'IN_REVIEW',     'COMPLIANT',    '2026-05-20',NULL,         4500.00,''),
  ('Warehouse 2','ERP-W2-003','FINANCIAL',           'Q1 Financial Statement Review',        'P&L + BS variance review.',                'Finance',          'E. Adams',   'APPROVED',      'COMPLIANT',    '2026-04-30','2026-04-29',165000.00,''),
  ('Warehouse 2','ERP-W2-004','COMPLIANCE',          'FDA Cold Chain Compliance',            'FDA 21 CFR 1.908 review.',                 'Quality Assurance','P. Nguyen',  'PENDING_REVIEW','UNDER_REVIEW', '2026-06-12',NULL,        18000.00,''),
  ('Warehouse 2','ERP-W2-005','REGULATORY',          'OSHA 300A Posting',                    'Annual summary posting.',                  'Safety',           'E. Adams',   'APPROVED',      'COMPLIANT',    '2026-02-01','2026-01-30',    0.00,''),
  ('Warehouse 2','ERP-W2-006','FINANCIAL',           'Workers Comp Insurance Audit',         'Annual classification + premium audit.',   'Finance',          'E. Adams',   'PENDING_REVIEW','COMPLIANT',    '2026-06-15',NULL,        65000.00,''),
  ('Warehouse 2','ERP-W2-007','SAFETY_CERTIFICATION','Pallet Rack Engineering Cert',         'Post-incident re-certification required.', 'Operations',       'P. Nguyen',  'OVERDUE',       'NON_COMPLIANT','2026-04-15',NULL,         8500.00,'Recent aisle 12 damage requires re-cert'),
  ('Warehouse 2','ERP-W2-008','COMPLIANCE',          'Vendor Contract Compliance Review',    'Top vendor annual review.',                'Legal',            'E. Adams',   'IN_REVIEW',     'COMPLIANT',    '2026-05-28',NULL,        42000.00,''),
  ('Warehouse 2','ERP-W2-009','AUDIT',               'Annual Energy Efficiency Audit',       'ASHRAE Level 1 audit.',                    'Operations',       'P. Nguyen',  'PENDING_REVIEW','COMPLIANT',    '2026-06-30',NULL,            0.00,''),
  ('Warehouse 2','ERP-W2-010','REGULATORY',          'Hazardous Materials Inventory Report', 'Tier II reporting.',                       'Legal',            'P. Nguyen',  'APPROVED',      'COMPLIANT',    '2026-03-28','2026-03-26', 1500.00,''),
  ('Warehouse 2','ERP-W2-011','SAFETY_CERTIFICATION','Forklift Battery Charging Safety',     'Ventilation + spill kit verification.',    'Safety',           'E. Adams',   'REJECTED',      'UNDER_REVIEW', '2026-05-06',NULL,         2500.00,'Ventilation requirements not met'),
  ('Warehouse 2','ERP-W2-012','FINANCIAL',           'Year-End Inventory Valuation',         'FY26 standard-cost valuation.',            'Finance',          'E. Adams',   'PENDING_REVIEW','EXEMPT',       '2026-07-15',NULL,            0.00,'Subject to year-end consolidation only')

on conflict (instance_name, record_number) do update set
  record_type       = excluded.record_type,
  title             = excluded.title,
  description       = excluded.description,
  department        = excluded.department,
  responsible_party = excluded.responsible_party,
  status            = excluded.status,
  compliance_status = excluded.compliance_status,
  due_date          = excluded.due_date,
  completed_date    = excluded.completed_date,
  financial_impact  = excluded.financial_impact,
  notes             = excluded.notes,
  updated_at        = now();
