import { SupportTicket } from '../types';

export const INITIAL_SAMPLE_TICKETS: SupportTicket[] = [
  {
    ticket_id: 'T001',
    text: 'My payment was deducted from my bank account but the transaction failed on your website.',
    category: 'Payment'
  },
  {
    ticket_id: 'T002',
    text: 'I forgot my account password and cannot login to my dashboard even after reset.',
    category: 'Account'
  },
  {
    ticket_id: 'T003',
    text: 'I want to request an immediate refund for my cancelled order #98231.',
    category: 'Refund'
  },
  {
    ticket_id: 'T004',
    text: 'My credit card payment was declined at checkout with error code ERR_402.',
    category: 'Payment'
  },
  {
    ticket_id: 'T005',
    text: 'How can I change my registered email address and phone number on my profile?',
    category: 'Account'
  },
  {
    ticket_id: 'T006',
    text: 'The payment gateway charged me twice for a single monthly subscription renewal.',
    category: 'Payment'
  },
  {
    ticket_id: 'T007',
    text: 'My account has been locked due to multiple failed login attempts. Please unlock it.',
    category: 'Account'
  },
  {
    ticket_id: 'T008',
    text: 'I received a damaged product and need to process a return and full refund.',
    category: 'Refund'
  },
  {
    ticket_id: 'T009',
    text: 'The application crashes immediately when I try to export my report to PDF.',
    category: 'Technical'
  },
  {
    ticket_id: 'T010',
    text: 'Where is my order package? The tracking number shows no status updates for 5 days.',
    category: 'Shipping'
  },
  {
    ticket_id: 'T011',
    text: 'I want to cancel my annual auto-renewal subscription before next billing cycle.',
    category: 'Refund'
  },
  {
    ticket_id: 'T012',
    text: 'Internal 500 server error when opening the customer analytics page.',
    category: 'Technical'
  },
  {
    ticket_id: 'T013',
    text: 'My delivery courier marked the package as delivered, but I never received anything.',
    category: 'Shipping'
  },
  {
    ticket_id: 'T014',
    text: 'Two-factor authentication 2FA SMS code is not arriving on my mobile phone.',
    category: 'Account'
  },
  {
    ticket_id: 'T015',
    text: 'Payment via PayPal is stuck on pending status for over 24 hours.',
    category: 'Payment'
  },
  {
    ticket_id: 'T016',
    text: 'The return item was delivered back to your warehouse. When will my refund be credited?',
    category: 'Refund'
  },
  {
    ticket_id: 'T017',
    text: 'The web app is extremely slow and times out with error 504 gateway timeout.',
    category: 'Technical'
  },
  {
    ticket_id: 'T018',
    text: 'Need to update the delivery shipping address before the shipment departs.',
    category: 'Shipping'
  },
  {
    ticket_id: 'T019',
    text: 'My UPI transaction was debited but the order status is still unpaid.',
    category: 'Payment'
  },
  {
    ticket_id: 'T020',
    text: 'I cannot delete my user profile and remove my stored payment methods.',
    category: 'Account'
  },
  {
    ticket_id: 'T021',
    text: 'Refund was approved by agent last week but the money has not reached my bank.',
    category: 'Refund'
  },
  {
    ticket_id: 'T022',
    text: 'API rate limit exceeded response 429 received when syncing data.',
    category: 'Technical'
  },
  {
    ticket_id: 'T023',
    text: 'Customs clearance delay on international parcel shipment to Singapore.',
    category: 'Shipping'
  },
  {
    ticket_id: 'T024',
    text: 'Invoice receipt is missing company GST tax number for business reimbursement.',
    category: 'Payment'
  },
  {
    ticket_id: 'T025',
    text: 'Suspicious login alert received from an unknown IP address in London.',
    category: 'Account'
  },
  {
    ticket_id: 'T026',
    text: 'Product sizing was wrong, requesting replacement or refund voucher.',
    category: 'Refund'
  },
  {
    ticket_id: 'T027',
    text: 'Database connection failed when attempting to sync offline records.',
    category: 'Technical'
  },
  {
    ticket_id: 'T028',
    text: 'Express overnight delivery option was paid for but package took four days.',
    category: 'Shipping'
  },
  {
    ticket_id: 'T029',
    text: 'Promo discount coupon code was not applied to the final billing checkout amount.',
    category: 'Payment'
  },
  {
    ticket_id: 'T030',
    text: 'I want to merge two existing accounts under my primary corporate email.',
    category: 'Account'
  }
];

export const TEAM_MEMBERS = [
  {
    name: 'Tharani',
    role: 'Dataset Engineering & Preprocessing Lead',
    contributions: [
      'Engineered support ticket corpus with balanced categorical distributions (Payment, Account, Refund, Technical, Shipping).',
      'Implemented regular expression cleaning pipeline: URL/email scrubbers, punctuation/special-character normalization, and case standardization.',
      'Designed stopword elimination module and token extraction tokenizer.'
    ]
  },
  {
    name: 'Lalitha',
    role: 'Morphology & Syntactic POS Tagging Lead',
    contributions: [
      'Implemented Martin Porter 1980 Stemming Algorithm with 5-stage affix rules and syllable measure (m) logic.',
      'Constructed Penn Treebank & Universal POS Tagger with lexical lookup, morphological rule heuristics, and contextual disambiguation.',
      'Built interactive morphology tracing and grammatical syntax inspector components.'
    ]
  },
  {
    name: 'Tejasri',
    role: 'Information Retrieval & Algorithmic Search Lead',
    contributions: [
      'Implemented Vector Space Model TF-IDF with L2 Euclidean normalization and Cosine Similarity scoring.',
      'Engineered Okapi BM25 ranking algorithm with non-linear saturation (k1=1.5) and document length normalization (b=0.75).',
      'Developed live side-by-side search suite with latency profiling and matched token visualizers.'
    ]
  },
  {
    name: 'Anusha',
    role: 'Evaluation, Error Analysis & Decision Engine Lead',
    contributions: [
      'Designed quantitative evaluation engine computing empirical Precision@K, Recall@K, F1@K, and MRR from ground-truth data.',
      'Formulated comprehensive error taxonomy identifying OOV terms, polysemy, syntactic negation, and length disparities.',
      'Engineered automated multi-criteria Decision Engine synthesising benchmark metrics into an architectural recommendation.'
    ]
  }
];

export const SAMPLE_CSV_STRING = `ticket_id,text,category
T001,"My payment was deducted from my bank account but the transaction failed on your website.",Payment
T002,"I forgot my account password and cannot login to my dashboard even after reset.",Account
T003,"I want to request an immediate refund for my cancelled order #98231.",Refund
T004,"My credit card payment was declined at checkout with error code ERR_402.",Payment
T005,"How can I change my registered email address and phone number on my profile?",Account
T006,"The payment gateway charged me twice for a single monthly subscription renewal.",Payment
T007,"My account has been locked due to multiple failed login attempts. Please unlock it.",Account
T008,"I received a damaged product and need to process a return and full refund.",Refund
T009,"The application crashes immediately when I try to export my report to PDF.",Technical
T010,"Where is my order package? The tracking number shows no status updates for 5 days.",Shipping
T011,"I want to cancel my annual auto-renewal subscription before next billing cycle.",Refund
T012,"Internal 500 server error when opening the customer analytics page.",Technical
T013,"My delivery courier marked the package as delivered, but I never received anything.",Shipping
T014,"Two-factor authentication 2FA SMS code is not arriving on my mobile phone.",Account
T015,"Payment via PayPal is stuck on pending status for over 24 hours.",Payment
T016,"The return item was delivered back to your warehouse. When will my refund be credited?",Refund
T017,"The web app is extremely slow and times out with error 504 gateway timeout.",Technical
T018,"Need to update the delivery shipping address before the shipment departs.",Shipping
T019,"My UPI transaction was debited but the order status is still unpaid.",Payment
T020,"I cannot delete my user profile and remove my stored payment methods.",Account
T021,"Refund was approved by agent last week but the money has not reached my bank.",Refund
T022,"API rate limit exceeded response 429 received when syncing data.",Technical
T023,"Customs clearance delay on international parcel shipment to Singapore.",Shipping
T024,"Invoice receipt is missing company GST tax number for business reimbursement.",Payment
T025,"Suspicious login alert received from an unknown IP address in London.",Account
T026,"Product sizing was wrong, requesting replacement or refund voucher.",Refund
T027,"Database connection failed when attempting to sync offline records.",Technical
T028,"Express overnight delivery option was paid for but package took four days.",Shipping
T029,"Promo discount coupon code was not applied to the final billing checkout amount.",Payment
T030,"I want to merge two existing accounts under my primary corporate email.",Account`;
