// ===== .\src\app\[locale]\dashboard\notifications\page.tsx =====
const notifications = [
    { title: "XÁC NHẬN THANH TOÁN", date: "15/10/2025" },
    { title: "CẬP NHẬT HỆ THỐNG", date: "14/10/2025" },
    { title: "XÁC NHẬN THANH TOÁN", date: "13/10/2025" },
    { title: "BẢO TRÌ DỰ KIẾN", date: "12/10/2025" },
    { title: "XÁC NHẬN THANH TOÁN", date: "11/10/2025" },
    { title: "CẬP NHẬT HỆ THỐNG", date: "10/10/2025" },
    { title: "XÁC NHẬN THANH TOÁN", date: "09/10/2025" },
];
const content = "Đây là nội dung, nội dung là đây nè đây là nội dung nhé lorem ipsum ipsum loren hello hihihi. Đây là nội dung, nội dung là đây nè đây là nội dung nhé lorem ipsum ipsum loren hello hihihi.";

const NotificationCard = ({ title, date, content }: { title: string, date: string, content: string }) => (
    <div className="w-full bg-white rounded-[20px] p-6 shadow-md">
        <h3 className="text-neutral-950 text-xl font-semibold font-['Unbounded']">{title}</h3>
        <p className="mt-4 text-neutral-700 text-xl font-medium">{content}</p>
        <p className="mt-6 text-neutral-700 text-xl font-medium">{date}</p>
    </div>
);

export default function NotificationsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">Thông báo</h1>
            <div className="space-y-8">
                {notifications.map((item, index) => (
                    <NotificationCard key={index} title={item.title} date={item.date} content={content} />
                ))}
            </div>
        </div>
    );
}