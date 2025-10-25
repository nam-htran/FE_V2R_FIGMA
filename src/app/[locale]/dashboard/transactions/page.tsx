// ===== .\src\app\[locale]\dashboard\transactions\page.tsx =====
const transactionsData = [
  { id: '01835193', name: 'Jim. Hogwarts', amount: '$420', service: 'Nâng cấp tài khoản Pro', status: 'Thành công', date: '06/07/2025', time: '04:20:42' },
  { id: '01835193', name: 'Jim. Hogwarts', amount: '$420', service: 'Nâng cấp tài khoản Pro', status: 'Thành công', date: '06/07/2025', time: '04:20:42' },
  { id: '01835193', name: 'Jim. Hogwarts', amount: '$420', service: 'Nâng cấp tài khoản Pro', status: 'Đang chờ', date: '06/07/2025', time: '04:20:42' },
  { id: '01835193', name: 'Jim. Hogwarts', amount: '$420', service: 'Nâng cấp tài khoản Pro', status: 'Đang chờ', date: '06/07/2025', time: '04:20:42' },
];

export default function TransactionsPage() {
    return (
        <div className="space-y-8">
             <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">Giao dịch</h1>
             <div className="bg-white rounded-2xl p-8">
                 <h2 className="text-black text-2xl font-semibold font-['Unbounded'] mb-6">Giao dịch gần đây</h2>
                 <div className="overflow-x-auto">
                     <table className="w-full text-left">
                         <thead className="bg-violet-300 rounded-md">
                             <tr className="text-black text-xl font-normal font-['Inter']">
                                 <th className="p-3">Mã giao dịch</th>
                                 <th className="p-3">Tên khách hàng</th>
                                 <th className="p-3">Số tiền</th>
                                 <th className="p-3">Gói dịch vụ</th>
                                 <th className="p-3">Trạng thái</th>
                                 <th className="p-3">Thời gian tạo</th>
                             </tr>
                         </thead>
                         <tbody>
                             {transactionsData.map((tx, index) => (
                                 <tr key={index} className="border-b">
                                     <td className="p-3 text-black text-xl font-normal">{tx.id}</td>
                                     <td className="p-3 text-black text-xl font-semibold">{tx.name}</td>
                                     <td className="p-3 text-black text-xl font-semibold">{tx.amount}</td>
                                     <td className="p-3 text-black text-xl font-normal">{tx.service}</td>
                                     <td className={`p-3 text-xl font-normal ${tx.status === 'Thành công' ? 'text-green-700' : 'text-amber-500'}`}>{tx.status}</td>
                                     <td className="p-3 text-black text-xl font-light">
                                         <div>{tx.date}</div>
                                         <div>{tx.time}</div>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
        </div>
    );
}