import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isTablet = width > 768;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: isTablet ? 40 : 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: isTablet ? 22 : 18,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: isTablet ? 40 : 20,
        paddingBottom: 20,
    },
    card: {
        borderRadius: 16,
        padding: isTablet ? 30 : 20,
        height: isTablet ? 240 : isSmallScreen ? 180 : 200,
        justifyContent: 'space-between',
        marginBottom: isTablet ? 40 : 30,
        maxWidth: isTablet ? 400 : '100%',
        alignSelf: isTablet ? 'center' : 'stretch',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBrand: {
        fontSize: isTablet ? 22 : 18,
        fontWeight: '600',
        color: '#FFF',
    },
    chipIcon: {
        width: isTablet ? 50 : 40,
        height: isTablet ? 38 : 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 6,
    },
    cardNumber: {
        fontSize: isTablet ? 22 : isSmallScreen ? 16 : 18,
        color: '#FFF',
        letterSpacing: 2,
        marginTop: 10,
    },
    cardBalance: {
        fontSize: isTablet ? 32 : isSmallScreen ? 24 : 28,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 5,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cardLabel: {
        fontSize: isTablet ? 12 : 10,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 4,
    },
    cardInfo: {
        fontSize: isTablet ? 16 : 14,
        fontWeight: '500',
        color: '#FFF',
    },
    label: {
        fontSize: isTablet ? 16 : 14,
        fontWeight: '500',
        color: '#000',
        marginBottom: 8,
        marginTop: isTablet ? 20 : 15,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: isTablet ? 18 : 15,
        gap: 10,
        minHeight: isTablet ? 56 : 50,
    },
    inputPlaceholder: {
        flex: 1,
        fontSize: isTablet ? 16 : 14,
        color: '#999',
    },
    textInput: {
        flex: 1,
        fontSize: isTablet ? 16 : 14,
        color: '#000',
        paddingVertical: 0,
    },
    row: {
        flexDirection: 'row',
        gap: isTablet ? 20 : 10,
    },
    addButton: {
        backgroundColor: '#FFDE31',
        borderRadius: 12,
        paddingVertical: isTablet ? 20 : 16,
        alignItems: 'center',
        marginTop: isTablet ? 40 : 30,
        minHeight: isTablet ? 60 : 50,
    },
    disabledButton: {
        opacity: 0.6,
    },
    addButtonText: {
        fontSize: isTablet ? 18 : 16,
        fontWeight: '600',
        color: '#000',
    },
    dropdown: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginTop: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        maxWidth: isTablet ? 400 : '100%',
    },
    dropdownItem: {
        paddingHorizontal: 15,
        paddingVertical: isTablet ? 15 : 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    dropdownText: {
        fontSize: isTablet ? 16 : 14,
        color: '#000',
    },
});