import { faker } from "@faker-js/faker";
import Papa from "papaparse";

export type FakeDataType = "users" | "companies" | "products" | "addresses";
export type FakeDataFormat = "json" | "csv";

export type FakeDataOptions = {
    type: FakeDataType;
    count: number;
    format: FakeDataFormat;
    seed?: number;
};

export type FakeDataResult =
    | {
        success: true;
        output: string;
        rowCount: number;
        fields: string[];
    }
    | {
        success: false;
        error: string;
    };

type FakeRecord = Record<string, string | number | boolean>;

function createUser(): FakeRecord {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        id: faker.string.uuid(),
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        username: faker.internet.username({ firstName, lastName }),
        phone: faker.phone.number(),
        jobTitle: faker.person.jobTitle(),
        createdAt: faker.date.recent({ days: 30 }).toISOString(),
    };
}

function createCompany(): FakeRecord {
    const companyName = faker.company.name();

    return {
        id: faker.string.uuid(),
        name: companyName,
        industry: faker.company.buzzNoun(),
        catchPhrase: faker.company.catchPhrase(),
        website: `https://${faker.internet.domainName()}`,
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number(),
        country: faker.location.country(),
    };
}

function createProduct(): FakeRecord {
    return {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        department: faker.commerce.department(),
        material: faker.commerce.productMaterial(),
        price: Number(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
        sku: faker.string.alphanumeric({ length: 10 }).toUpperCase(),
        inStock: faker.datatype.boolean(),
        description: faker.commerce.productDescription(),
    };
}

function createAddress(): FakeRecord {
    return {
        id: faker.string.uuid(),
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
    };
}

function createRecord(type: FakeDataType): FakeRecord {
    switch (type) {
        case "users":
            return createUser();

        case "companies":
            return createCompany();

        case "products":
            return createProduct();

        case "addresses":
            return createAddress();

        default:
            return createUser();
    }
}

export function generateFakeData(options: FakeDataOptions): FakeDataResult {
    if (options.count < 1 || options.count > 500) {
        return {
            success: false,
            error: "Count must be between 1 and 500.",
        };
    }

    if (typeof options.seed === "number" && Number.isFinite(options.seed)) {
        faker.seed(options.seed);
    } else {
        faker.seed(Date.now());
    }

    try {
        const data = Array.from({ length: options.count }, () =>
            createRecord(options.type)
        );

        const fields = Object.keys(data[0] ?? {});

        const output =
            options.format === "json"
                ? JSON.stringify(data, null, 2)
                : Papa.unparse(data, {
                    header: true,
                    columns: fields,
                });

        return {
            success: true,
            output,
            rowCount: data.length,
            fields,
        };
    } catch {
        return {
            success: false,
            error: "Could not generate fake data.",
        };
    }
}