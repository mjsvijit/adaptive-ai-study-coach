export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    message?: string;
    error?: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        roleId: string;
        phone: string;
        phoneVerified: boolean;
        emailVerified: boolean;
        step: number;
        isActive: boolean;
        createdAt: string;
        deletedAt: string | null;
        role: {
            code: string;
            id: string;
            name: string;
            description: string;
        };
        userDetails: {
            id: string;
            userId: string;
            wilayahId: string | null;
            communeId: string | null;
            interest: string | null;
            agencyName: string | null;
            professionalLicenseId: string | null;
            officeAddress: string | null;
            coordinates: {
                crs: {
                    type: string;
                    properties: {
                        name: string;
                    };
                };
                type: string;
                coordinates: [number, number];
            } | null;
            companyName: string | null;
            RCNumber: string | null;
            logo: string | null;
            website: string | null;
            logoMedia: {
                id: string;
                fieldName: string;
                fileName: string;
                fileType: string;
                mimeType: string;
                url: string;
                size: number;
                uploadedBy: string;
                metadata: any | null;
            } | null;
        } | null;
        userDocuments: {
            id: string;
            userId: string;
            mediaId: string;
            documentType:
                | "trade_register_certificate"
                | "tax_registration_document"
                | "beneficial_owner_declaration"
                | "other";
            status: string;
            remarks: string | null;
            deletedAt: string | null;
            createdAt: string;
            media: {
                id: string;
                fieldName: string;
                fileName: string;
                fileType: string;
                mimeType: string;
                url: string;
                size: number;
                uploadedBy: string;
                metadata: any | null;
            };
        }[];
        profile_image: string | null;
    };
}
