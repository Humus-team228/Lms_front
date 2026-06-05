// src/shared/hooks/useTurnoverAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import { userService, UserDTO } from '@/shared/api/user';
import { useAuth } from '@/app/providers/AuthProvider';

export interface TurnoverStats {
    totalEmployees: number;
    activeEmployees: number;
    firedEmployees: number;
    turnoverRate: number;
    avgTenureDays: number;
    newHiresLastMonth: number;
    firedByStage: Array<{
        stage: string;
        count: number;
        percentage: number;
    }>;
    turnoverByGroup: Array<{
        managerName: string;
        total: number;
        fired: number;
        rate: number;
    }>;
    recentTurnover: UserDTO[];
}

export function useTurnoverAnalytics() {
    const { user } = useAuth();
    const headId = user ? parseInt(user.id, 10) : null;

    return useQuery<TurnoverStats>({
        queryKey: ['turnover-analytics', headId],
        queryFn: async () => {
            if (!headId) throw new Error('Head ID not found');

            const allUsers = await userService.getUsers();

            // 🔹 Фильтруем сотрудников направления (подчиненных headId или его групп)
            const deptEmployees = allUsers.filter(u => {
                // Логика: показываем всех, кроме админов и самого head
                return u.roleCode !== 'ADMIN' && u.id !== headId;
            });

            const activeEmployees = deptEmployees.filter(u => u.activeFlag && u.statusCode === 'ACTIVE');
            const firedEmployees = deptEmployees.filter(u => !u.activeFlag || u.statusCode === 'FIRED');

            // 🔹 Расчет текучести
            const totalEmployees = deptEmployees.length;
            const turnoverRate = totalEmployees > 0
                ? (firedEmployees.length / totalEmployees) * 100
                : 0;

            // 🔹 Средний срок работы (в днях)
            const now = new Date();
            const avgTenureDays = activeEmployees.length > 0
                ? activeEmployees.reduce((sum, emp) => {
                const hireDate = new Date(emp.hireDate);
                const daysWorked = Math.floor((now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24));
                return sum + daysWorked;
            }, 0) / activeEmployees.length
                : 0;

            // 🔹 Новые сотрудники за последний месяц
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            const newHiresLastMonth = deptEmployees.filter(emp => {
                const hireDate = new Date(emp.hireDate);
                return hireDate >= oneMonthAgo;
            }).length;

            // 🔹 Текучесть по группам (руководителям)
            const groupsMap = new Map<string, { total: number; fired: number }>();
            deptEmployees.forEach(emp => {
                const managerName = emp.managerName || 'Без руководителя';
                if (!groupsMap.has(managerName)) {
                    groupsMap.set(managerName, { total: 0, fired: 0 });
                }
                const group = groupsMap.get(managerName)!;
                group.total++;
                if (!emp.activeFlag || emp.statusCode === 'FIRED') {
                    group.fired++;
                }
            });

            const turnoverByGroup = Array.from(groupsMap.entries()).map(([managerName, data]) => ({
                managerName,
                total: data.total,
                fired: data.fired,
                rate: data.total > 0 ? (data.fired / data.total) * 100 : 0,
            })).sort((a, b) => b.rate - a.rate);

            // 🔹 Последние уволенные (топ-10)
            const recentTurnover = firedEmployees
                .sort((a, b) => new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime())
                .slice(0, 10);

            // 🔹 Увольнения по этапам обучения (заглушка - в реальности нужно связывать с прогрессом)
            const firedByStage = [
                { stage: 'Онбординг (0-3 месяца)', count: Math.floor(firedEmployees.length * 0.4), percentage: 40 },
                { stage: 'Адаптация (3-6 месяцев)', count: Math.floor(firedEmployees.length * 0.3), percentage: 30 },
                { stage: 'Развитие (6+ месяцев)', count: Math.floor(firedEmployees.length * 0.3), percentage: 30 },
            ];

            return {
                totalEmployees,
                activeEmployees: activeEmployees.length,
                firedEmployees: firedEmployees.length,
                turnoverRate,
                avgTenureDays: Math.round(avgTenureDays),
                newHiresLastMonth,
                firedByStage,
                turnoverByGroup,
                recentTurnover,
            };
        },
        enabled: !!headId,
        staleTime: 5 * 60 * 1000, // 5 минут
        refetchOnWindowFocus: true,
    });
}