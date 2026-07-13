import { FiEdit } from 'react-icons/fi'; // add import at top

const columns = [
    { header: 'Reference', accessor: 'reference' as keyof Transaction },
    { header: 'Amount', accessor: (tx: Transaction) => `${tx.amount} ${tx.currency}` },
    { header: 'Status', accessor: (tx: Transaction) => ( /* ... same ... */ ) },
    { header: 'Risk', accessor: 'risk_score' as keyof Transaction },
    {
      header: 'Actions',
      accessor: (tx: Transaction) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/transactions/${tx.id}/edit`);
          }}
          className="text-indigo-600 hover:text-indigo-800"
        >
          <FiEdit />
        </button>
      ),
    },
];