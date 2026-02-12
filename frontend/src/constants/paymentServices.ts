export type PaymentSection = 'Payments' | 'Insurance' | 'Others';

export interface PaymentProvider {
    id: string;
    name: string;
    icon: string;
}

export interface PaymentField {
    key: string;
    label: string;
    placeholder: string;
    icon: string;
    keyboardType?: 'default' | 'numeric' | 'number-pad';
}

export interface PaymentServiceConfig {
    key: string;
    label: string;
    section: PaymentSection;
    icon: string;
    providers: PaymentProvider[];
    fields: PaymentField[];
}

const REGULAR_PROVIDERS: PaymentProvider[] = [
    { id: 'nexpay', name: 'Nexpay', icon: 'business-outline' },
    { id: 'smartpay', name: 'SmartPay', icon: 'wallet-outline' },
    { id: 'quicklink', name: 'QuickLink', icon: 'flash-outline' },
];

export const PAYMENT_SERVICE_CONFIGS: PaymentServiceConfig[] = [
    {
        key: 'internet',
        label: 'Internet',
        section: 'Payments',
        icon: 'wifi',
        providers: [
            { id: 'comcast', name: 'Comcast', icon: 'business-outline' },
            { id: 'spectrum', name: 'Spectrum', icon: 'wifi-outline' },
            { id: 'att', name: 'AT&T', icon: 'cellular-outline' },
            { id: 'verizon', name: 'Verizon', icon: 'phone-portrait-outline' },
        ],
        fields: [
            { key: 'customerId', label: 'Customer ID', placeholder: 'Enter customer ID', icon: 'person-outline' },
        ],
    },
    {
        key: 'electricity',
        label: 'Electricity',
        section: 'Payments',
        icon: 'flash',
        providers: [
            { id: 'reg', name: 'REG', icon: 'flash-outline' },
            { id: 'citypower', name: 'City Power', icon: 'flash-outline' },
        ],
        fields: [
            { key: 'meterNumber', label: 'Meter Number', placeholder: 'Enter meter number', icon: 'speedometer-outline', keyboardType: 'number-pad' },
        ],
    },
    {
        key: 'water',
        label: 'Water',
        section: 'Payments',
        icon: 'water',
        providers: [
            { id: 'wasac', name: 'WASAC', icon: 'water-outline' },
            { id: 'aqua', name: 'Aqua Utility', icon: 'water-outline' },
        ],
        fields: [
            { key: 'customerId', label: 'Customer ID', placeholder: 'Enter customer ID', icon: 'person-outline' },
        ],
    },
    {
        key: 'television',
        label: 'Television',
        section: 'Payments',
        icon: 'tv',
        providers: [
            { id: 'dstv', name: 'DStv', icon: 'tv-outline' },
            { id: 'canal', name: 'Canal+', icon: 'tv-outline' },
            { id: 'startimes', name: 'StarTimes', icon: 'tv-outline' },
        ],
        fields: [
            { key: 'decoderNumber', label: 'Decoder Number', placeholder: 'Enter decoder number', icon: 'desktop-outline', keyboardType: 'number-pad' },
        ],
    },
    {
        key: 'games',
        label: 'Games',
        section: 'Payments',
        icon: 'game-controller',
        providers: [
            { id: 'steam', name: 'Steam', icon: 'game-controller-outline' },
            { id: 'xbox', name: 'Xbox', icon: 'game-controller-outline' },
            { id: 'playstation', name: 'PlayStation', icon: 'game-controller-outline' },
        ],
        fields: [
            { key: 'gamerId', label: 'Gamer ID', placeholder: 'Enter gamer ID', icon: 'person-outline' },
        ],
    },
    {
        key: 'tax',
        label: 'Tax',
        section: 'Payments',
        icon: 'receipt',
        providers: [
            { id: 'rra', name: 'RRA', icon: 'receipt-outline' },
            { id: 'city', name: 'City Revenue', icon: 'business-outline' },
        ],
        fields: [
            { key: 'tin', label: 'TIN Number', placeholder: 'Enter TIN number', icon: 'document-text-outline' },
            { key: 'assessmentNo', label: 'Assessment No.', placeholder: 'Enter assessment number', icon: 'receipt-outline' },
        ],
    },
    {
        key: 'lifestyle',
        label: 'Lifestyle',
        section: 'Payments',
        icon: 'bag',
        providers: REGULAR_PROVIDERS,
        fields: [
            { key: 'memberId', label: 'Member ID', placeholder: 'Enter member ID', icon: 'card-outline' },
        ],
    },
    {
        key: 'va_number',
        label: 'VA Number',
        section: 'Payments',
        icon: 'phone-portrait',
        providers: REGULAR_PROVIDERS,
        fields: [
            { key: 'vaNumber', label: 'VA Number', placeholder: 'Enter virtual account number', icon: 'document-text-outline', keyboardType: 'number-pad' },
        ],
    },
    {
        key: 'health',
        label: 'Health',
        section: 'Insurance',
        icon: 'heart',
        providers: [
            { id: 'radiant', name: 'Radiant Health', icon: 'medkit-outline' },
            { id: 'lifecare', name: 'LifeCare', icon: 'medkit-outline' },
        ],
        fields: [
            { key: 'policyNumber', label: 'Policy Number', placeholder: 'Enter policy number', icon: 'shield-checkmark-outline' },
            { key: 'memberId', label: 'Member ID', placeholder: 'Enter member ID', icon: 'person-outline' },
        ],
    },
    {
        key: 'car',
        label: 'Car',
        section: 'Insurance',
        icon: 'car',
        providers: [
            { id: 'primeauto', name: 'Prime Auto Cover', icon: 'car-outline' },
            { id: 'safeauto', name: 'Safe Auto', icon: 'car-outline' },
        ],
        fields: [
            { key: 'policyNumber', label: 'Policy Number', placeholder: 'Enter policy number', icon: 'shield-checkmark-outline' },
            { key: 'plateNumber', label: 'Plate Number', placeholder: 'Enter plate number', icon: 'car-outline' },
        ],
    },
    {
        key: 'motorcycle',
        label: 'Motorcycle',
        section: 'Insurance',
        icon: 'bicycle',
        providers: [
            { id: 'motoguard', name: 'MotoGuard', icon: 'bicycle-outline' },
            { id: 'ridesafe', name: 'RideSafe', icon: 'bicycle-outline' },
        ],
        fields: [
            { key: 'policyNumber', label: 'Policy Number', placeholder: 'Enter policy number', icon: 'shield-checkmark-outline' },
            { key: 'plateNumber', label: 'Plate Number', placeholder: 'Enter plate number', icon: 'bicycle-outline' },
        ],
    },
    {
        key: 'property',
        label: 'Property',
        section: 'Insurance',
        icon: 'business',
        providers: [
            { id: 'homeguard', name: 'HomeGuard', icon: 'home-outline' },
            { id: 'assetshield', name: 'AssetShield', icon: 'business-outline' },
        ],
        fields: [
            { key: 'policyNumber', label: 'Policy Number', placeholder: 'Enter policy number', icon: 'shield-checkmark-outline' },
            { key: 'propertyId', label: 'Property ID', placeholder: 'Enter property ID', icon: 'home-outline' },
        ],
    },
    {
        key: 'investment',
        label: 'Investment',
        section: 'Others',
        icon: 'trending-up',
        providers: REGULAR_PROVIDERS,
        fields: [
            { key: 'accountNumber', label: 'Investment Account', placeholder: 'Enter investment account number', icon: 'trending-up-outline' },
        ],
    },
    {
        key: 'credit',
        label: 'Credit',
        section: 'Others',
        icon: 'card',
        providers: REGULAR_PROVIDERS,
        fields: [
            { key: 'loanAccountNumber', label: 'Credit Account', placeholder: 'Enter credit/loan account number', icon: 'card-outline' },
        ],
    },
    {
        key: 'donate',
        label: 'Donate',
        section: 'Others',
        icon: 'gift',
        providers: REGULAR_PROVIDERS,
        fields: [
            { key: 'campaignCode', label: 'Campaign Code', placeholder: 'Enter campaign code', icon: 'gift-outline' },
        ],
    },
];

export const getPaymentServiceByKey = (serviceKey?: string) => {
    if (!serviceKey) return PAYMENT_SERVICE_CONFIGS[0];
    return PAYMENT_SERVICE_CONFIGS.find((service) => service.key === serviceKey) || PAYMENT_SERVICE_CONFIGS[0];
};
