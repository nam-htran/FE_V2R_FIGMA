// ===== .\src/app\[locale]\dashboard\customers\page.tsx =====
const customersData = [
  { name: 'Jim. Hogwarts', email: 'papapa7...', plan: 'Basic', models: 20, status: 'Hoạt động', date: '06/07/2025', time: '04:20:42' },
  { name: 'Jim. Hogwarts', email: 'papapa7...', plan: 'Basic', models: 17, status: 'Hoạt động', date: '06/07/2025', time: '04:20:42' },
  { name: 'Jim. Hogwarts', email: 'papapa7...', plan: 'Pro', models: 199, status: 'Hoạt động', date: '06/07/2025', time: '04:20:42' },
  { name: 'Jim. Hogwarts', email: 'papapa7...', plan: 'Basic', models: 15, status: 'Hoạt động', date: '06/07/2025', time: '04:20:42' },
  { name: 'Jim. Hogwarts', email: 'papapa7...', plan: 'Basic', models: 42, status: 'Hoạt động', date: '06/07/2025', time: '04:20:42' },
];

export default function CustomersPage() {
    return (
        <div className="space-y-8">
             <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">Khách hàng</h1>
             <div className="bg-white rounded-2xl p-8">
                 <h2 className="text-black text-2xl font-semibold font-['Unbounded'] mb-6">Danh sách khách hàng</h2>
                 <div className="overflow-x-auto">
                     <table className="w-full text-left">
                         <thead className="bg-violet-300 rounded-md">
                             <tr className="text-black text-xl font-normal font-['Inter']">
                                 <th className="p-3">Tên khách hàng</th>
                                 <th className="p-3">Email</th>
                                 <th className="p-3">Gói dịch vụ</th>
                                 <th className="p-3">Số lượng mô hình</th>
                                 <th className="p-3">Trạng thái</th>
                                 <th className="p-3">Ngày đăng ký</th>
                             </tr>
                         </thead>
                         <tbody>
                             {customersData.map((customer, index) => (
                                 <tr key={index} className="border-b">
                                     <td className="p-3 text-black text-xl font-semibold">{customer.name}</td>
                                     <td className="p-3 text-black text-xl font-light">{customer.email}</td>
                                     <td className={`p-3 text-xl font-semibold ${customer.plan === 'Pro' ? 'text-blue-900' : 'text-black'}`}>{customer.plan}</td>
                                     <td className="p-3 text-black text-xl font-light">{customer.models}</td>
                                     <td className="p-3 text-green-700 text-xl font-normal">{customer.status}</td>
                                     <td className="p-3 text-black text-xl font-light">
                                         <div>{customer.date}</div>
                                         <div>{customer.time}</div>
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