export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone?: string;
    salary?: number;
    hireDate: string;
    status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
    departmentId: string;
    departmentName: string;
    roleId: string;
    roleName: string;
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    salary: number;
    hireDate: string;
    status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
    departmentId: string;
    roleId: string;
}

export interface PageResponse {
    content: Employee[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}