// src/shared/hooks/useUsersQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/shared/api/user';
import { mapUserDTO, User, CreateUserRequest, UpdateUserRequest } from '@/shared/types/user';

// 🔹 Хук для получения списка пользователей
export function useUsersQuery() {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const data = await userService.getUsers();
            return data.map(mapUserDTO);
        },
        staleTime: 5 * 60 * 1000, // 5 минут
        refetchOnWindowFocus: false,
    });
}

// 🔹 Хук для создания пользователя
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CreateUserRequest) => userService.createUser(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}
export function useUpdateUserStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, statusId }: { userId: number; statusId: number }) =>
            userService.updateUserStatus(userId, statusId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}
// 🔹 Хук для обновления пользователя
export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, request }: { userId: number; request: UpdateUserRequest }) =>
            userService.updateUser(userId, request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

// 🔹 Хук для удаления пользователя
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => userService.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

// 🔹 Хук для блокировки/разблокировки
export function useToggleUserStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ userId, isBlocked }: { userId: number; isBlocked: boolean }) => {
            if (isBlocked) {
                await userService.blockUser(userId);
            } else {
                await userService.unblockUser(userId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}