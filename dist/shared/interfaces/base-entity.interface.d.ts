export interface BaseEntity {
    _id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface TenantEntity extends BaseEntity {
    agencyId: string;
}
