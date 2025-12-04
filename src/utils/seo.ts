import { Metadata } from 'next';

export const defaultMetadata: Metadata = {
    metadataBase: new URL('https://ubiquiti-uae.com/'),
    title: {
        default: 'Ubiquiti UAE - Authorized Distributor | Networking & Security Solutions',
        template: '%s | Ubiquiti UAE',
    },
    description:
        'Ubiquiti UAE - Authorized Distributor. Premium genuine UniFi, EdgeMAX, and airMAX networking equipment, security cameras, and professional enterprise solutions across UAE and Dubai.',
    keywords: [
        'Ubiquiti UAE',
        'Ubiquiti Dubai',
        'Ubiquiti authorized distributor',
        'Ubiquiti distributor UAE',
        'Ubiquiti distributor Dubai',
        'UniFi UAE',
        'UniFi Dubai',
        'UniFi Access Points',
        'UniFi Dream Machine',
        'UniFi Switches',
        'UniFi Gateway',
        'EdgeMAX UAE',
        'EdgeMAX Dubai',
        'airMAX UAE',
        'airMAX Dubai',
        'Ubiquiti Networks UAE',
        'Ubiquiti cameras UAE',
        'UniFi Protect cameras',
        'network equipment distributor',
        'professional networking solutions',
        'enterprise networking UAE',
        'enterprise networking Dubai',
        'WiFi 6 access points UAE',
        'mesh networking systems',
        'network security solutions UAE',
        'PoE switches distributor',
        'UniFi Cloud Gateway UAE',
        'Ubiquiti authorized reseller',
        'Ubiquiti official distributor UAE',
        'UISP management platform',
        'UniFi OS controller',
        'network management solutions',
        'IT infrastructure UAE',
        'SD-WAN solutions Dubai',
        'point-to-point wireless links',
        'network switches distributor',
        'Ubiquiti routers UAE',
        'UniFi Console distributor',
        'UniFi Express systems',
        'UniFi Professional networks',
        'Ubiquiti warranty support UAE',
        'authorized Ubiquiti distributor',
        'UniFi Enterprise solutions',
        'Ubiquiti technical support',
    ],
    authors: [{ name: 'Ubiquiti UAE' }],
    creator: 'Ubiquiti UAE',
    publisher: 'Ubiquiti UAE',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
        other: {
            rel: 'mask-icon',
            url: '/safari-pinned-tab.svg',
            color: '#0556F3', 
        },
    },
    openGraph: {
        type: 'website',
        siteName: 'Ubiquiti UAE',
        locale: 'en_AE',
        url: 'https://ubiquiti-uae.com',
        title: 'Ubiquiti UAE - Authorized Distributor | Networking & Security Solutions',
        description:
            'Ubiquiti UAE - Authorized Distributor of genuine enterprise networking equipment, UniFi systems, security cameras, and professional IT solutions across UAE and Dubai with local expert support.',
        images: [
            {
                url: '/images/ubiquiti-uae-og.jpg',
                width: 1200,
                height: 630,
                alt: 'Ubiquiti UAE Official Store',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@ubiquitiuae',
        creator: '@ubiquitiuae',
        title: 'Ubiquiti UAE - Authorized Distributor | Networking & Security Solutions',
        description:
            'Ubiquiti UAE - Authorized Distributor offering genuine networking equipment, UniFi systems, security cameras, and IT solutions throughout UAE and Dubai.',
        images: ['/images/ubiquiti-uae-twitter.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: 'https://ubiquiti-uae.com',
        languages: {
            'en-AE': 'https://ubiquiti-uae.com/',
            'ar-AE': 'https://ubiquiti-uae.com/ar/',
        },
    },
    verification: {
        google: 'YOUR_GOOGLE_VERIFICATION_CODE_HERE',
    },
    other: {
        'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE_HERE',
    },
    generator: 'Ubiquiti UAE Official Website',
    applicationName: 'Ubiquiti UAE',
    referrer: 'origin-when-cross-origin',
    manifest: '/site.webmanifest',
};

// ✅ Organization Schema (JSON-LD)
export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ubiquiti UAE',
    alternateName: 'Ubiquiti United Arab Emirates',
    description:
        'Authorized Ubiquiti Distributor in UAE providing genuine enterprise networking equipment, UniFi systems, security solutions, and professional IT infrastructure throughout Dubai and the Emirates.',
    url: 'https://ubiquiti-uae.com',
    logo: '/images/ubiquiti-uae-logo.png',
    foundingDate: '2018-01-01',
    contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+971509664956',
        contactType: 'customer service',
        email: 'sales@ubiquiti-uae.com ',
        areaServed: 'AE',
        availableLanguage: ['English', 'Arabic'],
    },
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Baghlaf Building Showroom No.5 Satellite Market Naif Deira - Dubai United Arab Emirates.',
        addressLocality: '25th St - Naif - Dubai',
        addressRegion: '25th St - Naif - Dubai',
        postalCode: '123421',
        addressCountry: 'AE',
    },
    areaServed: {
        '@type': 'Country',
        name: 'United Arab Emirates',
        alternateName: 'UAE',
    },
    knowsAbout: [
        'Enterprise Networking',
        'Wireless Solutions',
        'Network Security',
        'UniFi Systems',
        'EdgeMAX Routers',
        'airMAX Wireless',
        'UniFi Protect',
        'Network Switches',
        'PoE Technology',
        'Mesh Networking',
        'SD-WAN',
        'IT Infrastructure'
    ],
    brand: {
        '@type': 'Brand',
        name: 'Ubiquiti',
        logo: '/images/ubiquiti-logo.png'
    }
};

// ✅ Dynamic Content Schema (JSON-LD)
export const dynamicContentSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            item: {
                '@type': 'WebPage',
                '@id': 'https://ubiquiti-uae.com/solution',
                name: 'UniFi Systems',
                description: 'Complete UniFi networking ecosystem including access points, switches, and consoles',
                url: 'https://ubiquiti-uae.com/solution',
            },
        },
        {
            '@type': 'ListItem',
            position: 2,
            item: {
                '@type': 'WebPage',
                '@id': 'https://ubiquiti-uae.com/about',
                name: 'EdgeMAX',
                description: 'Professional routing and switching solutions for enterprise networks',
                url: 'https://ubiquiti-uae.com/about',
            },
        },
        {
            '@type': 'ListItem',
            position: 3,
            item: {
                '@type': 'WebPage',
                '@id': 'https://ubiquiti-uae.com/contact',
                name: 'airMAX',
                description: 'Carrier-class wireless broadband solutions for ISPs and businesses',
                url: 'https://ubiquiti-uae.com/contact',
            },
        },
        {
            '@type': 'ListItem',
            position: 4,
            item: {
                '@type': 'WebPage',
                '@id': 'https://ubiquiti-uae.com/category',
                name: 'Categories',
                description: 'Browse our complete range of networking and security products',
                url: 'https://ubiquiti-uae.com/category',
            },
        },
        {
            '@type': 'ListItem',
            position: 5,
            item: {
                '@type': 'WebPage',
                '@id': 'https://ubiquiti-uae.com/solution/cloud-gatewayss',
                name: 'Cloud Gateways',
                description: 'Next-generation cloud-managed security gateways and routers',
                url: 'https://ubiquiti-uae.com/solution/cloud-gatewayss',
            },
        },
        {
            '@type': 'ListItem',
            position: 6,
            item: {
                '@type': 'WebPage',
                '@id': 'https://ubiquiti-uae.com/solution/switchings',
                name: 'Switching Solutions',
                description: 'Enterprise-grade network switches with PoE capabilities',
                url: 'https://ubiquiti-uae.com/solution/switchings',
            },
        },
         {
            '@type': 'ListItem',
            position: 7,
            item: {
                '@type': 'WebPage',
                '@id': 'https://ubiquiti-uae.com/solution/wifis',
                name: 'WiFi Solutions',
                description: 'High-performance wireless access points and mesh networking systems',
                url: 'https://ubiquiti-uae.com/solution/wifis',
            },
        },
        {
            '@type': 'ListItem',
            position: 8,
            item: {
                '@type': 'WebPage',
                '@id': 'https://ubiquiti-uae.com/solution/physical-securitys',
                name: 'Physical Security',
                description: 'UniFi Protect security cameras and access control systems',
                url: 'https://ubiquiti-uae.com/solution/physical-securitys',
            },
        },
         {
            '@type': 'ListItem',
            position: 9,
            item: {
                '@type': 'WebPage',
                '@id': 'https://ubiquiti-uae.com/solution/integrationss',
                name: 'System Integrations',
                description: 'Complete network and security system integration solutions',
                url: 'https://ubiquiti-uae.com/solution/integrationss',
            },
        },
    ],
};
export interface DynamicMetaData {
    title: string;
    description?: string;
    images?: string[];
    slug: string;
}

export const generateDynamicMetadata = (
    type: 'product' | 'category' | 'solutions' | 'support',
    data: DynamicMetaData
): Metadata => {
    return {
        title: data.title,
        description: data.description,
        openGraph: {
            title: data.title,
            description: data.description,
            images: data.images && data.images.length > 0 ? data.images : ['/images/ubiquiti-uae-default.jpg'],
            url: `https://ubiquiti-uae.com/${type}/${data.slug}`,
        },
        alternates: {
            canonical: `https://ubiquiti-uae.com/${type}/${data.slug}`,
        },
    };
};

export const generateCategorySchemaItem = (
    position: number,
    navbarSlug: string,
    categorySlug: string,
    name: string,
    description: string
) => ({
    '@type': 'ListItem',
    position,
    item: {
        '@type': 'WebPage',
        '@id': `https://ubiquiti-uae.com/${navbarSlug}/${categorySlug}`,
        name,
        description,
        url: `https://ubiquiti-uae.com/${navbarSlug}/${categorySlug}`,
    },
});

// ✅ Generate Metadata for Category Pages
export const generateCategoryMetadata = (
    navbarSlug: string,
    categorySlug: string,
    categoryName: string,
    categoryDescription: string,
    categoryImage?: string
): Metadata => {
    const title = `${categoryName} | Ubiquiti UAE`;
    const description = categoryDescription || `Explore our selection of ${categoryName} products. High-quality networking and security solutions in the UAE.`;
    const canonicalUrl = `https://ubiquiti-uae.com/${navbarSlug}/${categorySlug}`;
    const imageUrl = categoryImage || '/images/ubiquiti-uae-default.jpg';

    return {
        title,
        description,
        keywords: [
            categoryName,
            'Ubiquiti UAE',
            'Ubiquiti Dubai',
            `${categoryName} UAE`,
            `${categoryName} Dubai`,
            `${categoryName} distributor`,
            'Ubiquiti authorized distributor',
            'networking equipment UAE',
            'networking equipment Dubai',
            'security solutions UAE',
            'security solutions Dubai',
            'professional networking',
            'enterprise networking',
            'enterprise solutions',
        ],
        openGraph: {
            title,
            description,
            type: 'website',
            url: canonicalUrl,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: categoryName }],
            siteName: 'Ubiquiti UAE',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
        },
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
};

// ✅ Generate Metadata for SubCategory Pages
export const generateSubCategoryMetadata = (
    navbarSlug: string,
    categorySlug: string,
    subCategorySlug: string,
    categoryName: string,
    subCategoryName: string,
    description: string,
    image?: string
): Metadata => {
    const title = `${subCategoryName} - ${categoryName} | Ubiquiti UAE`;
    const metaDescription = description || `Browse ${subCategoryName} under ${categoryName}. Premium Ubiquiti solutions for UAE businesses.`;
    const canonicalUrl = `https://ubiquiti-uae.com/${navbarSlug}/${categorySlug}/${subCategorySlug}`;
    const imageUrl = image || '/images/ubiquiti-uae-default.jpg';

    return {
        title,
        description: metaDescription,
        keywords: [
            subCategoryName,
            categoryName,
            'Ubiquiti UAE',
            'Ubiquiti Dubai',
            `${subCategoryName} UAE`,
            `${subCategoryName} Dubai`,
            `${subCategoryName} distributor`,
            'genuine Ubiquiti products',
            'networking solutions UAE',
            'networking solutions Dubai',
            'security equipment UAE',
            'enterprise networking',
            'authorized distributor',
        ],
        openGraph: {
            title,
            description: metaDescription,
            type: 'website',
            url: canonicalUrl,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: subCategoryName }],
            siteName: 'Ubiquiti UAE',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: metaDescription,
            images: [imageUrl],
        },
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
};

// ✅ Generate Metadata for Product Pages
export const generateProductMetadata = (
    navbarSlug: string,
    categorySlug: string,
    subCategorySlug: string | undefined,
    productSlug: string,
    productName: string,
    productDescription: string,
    productImage: string,
    keyFeatures?: string[]
): Metadata => {
    const title = `${productName} | Ubiquiti UAE`;
    const metaDescription = productDescription || `Buy ${productName} from Ubiquiti UAE - Authorized Distributor. Premium genuine networking and security equipment across UAE and Dubai.`;
    
    const canonicalUrl = subCategorySlug
        ? `https://ubiquiti-uae.com/${navbarSlug}/${categorySlug}/${subCategorySlug}/${productSlug}`
        : `https://ubiquiti-uae.com/${navbarSlug}/${categorySlug}/${productSlug}`;

    const keywords = [
        productName,
        'Ubiquiti UAE',
        'Ubiquiti Dubai',
        `${productName} UAE`,
        `${productName} Dubai`,
        'buy genuine Ubiquiti UAE',
        'buy online Dubai',
        'networking equipment UAE',
        'security solutions Dubai',
        'professional networking',
        'authorized distributor',
        'enterprise solutions',
        ...(keyFeatures?.slice(0, 5) || []),
    ];

    return {
        title,
        description: metaDescription,
        keywords,
        openGraph: {
            title,
            description: metaDescription,
            type: 'website',
            url: canonicalUrl,
            images: [{ url: productImage, width: 800, height: 800, alt: productName }],
            siteName: 'Ubiquiti UAE',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: metaDescription,
            images: [productImage],
        },
        alternates: {
            canonical: canonicalUrl,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
};

// ✅ Generate Product Schema (JSON-LD)
export const generateProductSchema = (
    productName: string,
    productDescription: string,
    productImage: string,
    price?: string,
    inStock?: boolean
) => ({
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    image: productImage,
    brand: {
        '@type': 'Brand',
        name: 'Ubiquiti',
    },
    ...(price && {
        offers: {
            '@type': 'Offer',
            price,
            priceCurrency: 'AED',
            availability: inStock ? 'InStock' : 'OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'Ubiquiti UAE',
            },
        },
    }),
});

// ✅ Generate BreadcrumbList Schema (JSON-LD)
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
    })),
});