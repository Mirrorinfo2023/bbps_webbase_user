import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Tab,
    Tabs,
    Chip,
    Paper,
    Grid,
    Alert,
    AppBar,
    Toolbar,
    IconButton,
    Tooltip,
    Fade,
    useTheme,
    useMediaQuery,
    Button
} from '@mui/material';
import {
    ContentCopy,
    Code,
    Api,
    Http,
    Description,
    Smartphone,
    Computer,
    Check,
    Close,
    Security,
    Key
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[8],
    },
}));

const MethodChip = styled(Chip)(({ method, theme }) => {
    const colorMap = {
        GET: theme.palette.success.main,
        POST: theme.palette.info.main,
        PUT: theme.palette.warning.main,
        DELETE: theme.palette.error.main,
        PATCH: theme.palette.primary.main,
    };

    return {
        backgroundColor: colorMap[method] || theme.palette.grey[500],
        color: theme.palette.common.white,
        fontWeight: 'bold',
        minWidth: 80,
    };
});

const CodeBlock = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.grey[900],
    color: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
    fontSize: '0.875rem',
    overflowX: 'auto',
    position: 'relative',
}));

const SidebarTabs = styled(Tabs)(({ theme }) => ({
    borderRight: `1px solid ${theme.palette.divider}`,
    '& .MuiTab-root': {
        minHeight: 72,
        alignItems: 'flex-start',
        textAlign: 'left',
        padding: theme.spacing(1.5, 2),
    },
}));

const AuthChip = ({ required }) => (
    <Chip
        icon={required ? <Check /> : <Close />}
        label={required ? 'Required' : 'Not Required'}
        color={required ? 'success' : 'default'}
        size="small"
        variant={required ? 'filled' : 'outlined'}
    />
);

const EncryptionChip = ({ enabled }) => (
    <Chip
        icon={enabled ? <Security /> : <Close />}
        label={enabled ? 'Enabled' : 'Disabled'}
        color={enabled ? 'success' : 'default'}
        size="small"
        variant={enabled ? 'filled' : 'outlined'}
    />
);

const ApiDocumentation = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [copiedField, setCopiedField] = useState('');
    const [showEncrypted, setShowEncrypted] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Dummy encrypted data
    const apiData = [
        {
            id: 1,
            method: 'POST',
            endpoint: '/api/operator/8a6bb5e0bc0e95eec947e2327b2278d137373901',
            url: 'https://api.mayway.in/api/operator/8a6bb5e0bc0e95eec947e2327b2278d137373901',
            title: 'Get Operator',
            description: 'Get operator details with encrypted request and response examples.',
            authentication: true,
            encryption: true,
            requestBody: {
                category: "Electricity",
                page: 1,
                user_id: "12345"
            },
            encryptedRequestBody: {
                enc_data: "eyJ4emd2dGxpYiI6IlZvdnhnaXJ4cmdiIiwia3p0diI6OSwiZmh2aV9ydyI6Ijc5In0=",
            },
            response: { "status": 200, "message": "success", "data": [{ "id": 21250, "operator_name": "TP Southern Odisha Distribution Limited", "image": "http://localhost:4223/null", "category": "Electricity", "description": "IND-ODI", "status": 1, "biller_id": "SOUTHCO00ODI01" }, { "id": 19463, "operator_name": "Goa Electricity Department", "image": "http://localhost:4223/null", "category": "Electricity", "description": "IND-GOA", "status": 1, "biller_id": "GED000000GOA01" }, { "id": 19466, "operator_name": "Gulbarga Electricity Supply Company Limited", "image": "http://localhost:4223/null", "category": "Electricity", "description": "IND-KAR", "status": 1, "biller_id": "GESCOM000KAR01" }, { "id": 19469, "operator_name": "Gift Power Company Limited", "image": "http://localhost:4223/null", "category": "Electricity", "description": "IND-GUJ", "status": 1, "biller_id": "GIFT00000GUJ6Z" }, { "id": 19730, "operator_name": "Himachal Pradesh State Electricity Board", "image": "http://localhost:4223/null", "category": "Electricity", "description": "IND-HIP", "status": 1, "biller_id": "HPSEB0000HIP02" }] },
            encryptedResponse: {
                enc_response: "eyJzdGF0dXMiOiJzdWNjZXNzIiwidHJhbnNhY3Rpb25faWQiOiJUWE4yMDI0MDExNTEwMzAwMDEiLCJwYXltZW50X3N0YXR1cyI6ImluaXRpYXRlZCIsInVwaV9xcl9jb2RlIjoiaHR0cHM6Ly9hcGkucGF5c2VjdXJlLmNvbS9xci91cGkxMjM0NTYiLCJleHBpcnlfdGltZSI6IjIwMjQtMDEtMTVUMTA6NDU6MDBaIn0=",
            }
        },
        {
            id: 2,
            method: 'POST',
            endpoint: '/api/bill_payment/454a048ee09f82be251a44b976fadb1bf3f3a4e6',
            url: 'https://api.mayway.in/api/bill_payment/454a048ee09f82be251a44b976fadb1bf3f3a4e6',
            title: 'bbps Biller Info',
            description: 'Get BBPS biller info with encrypted request and response examples.',
            authentication: false,
            encryption: true,
            requestBody: {
                biller_id: "SOUTHCO00ODI01",
                user_id: "12345"
            },
            encryptedRequestBody: {
                encReq: "eyJ5cm9vdmlfcnciOiJITEZHU1hMMDBMV1IwOSIsImZodmlfcnciOiI3OSJ9"
            },
            response:
            {
                "status": 200,
                "data": {
                    "id": 1,
                    "biller_id": "SOUTHCO00ODI01",
                    "user_id": 34,
                    "biller_name": "TP Southern Odisha Distribution Limited",
                    "biller_coverage": null,
                    "biller_adhoc": null,
                    "distributor_id": "",
                    "mobile_no": "",
                    "consumer_id": "",
                    "biller_category": "Electricity",
                    "input_params": {
                        "paramInfo": {
                            "paramName": "Consumer Number",
                            "dataType": "ALPHANUMERIC",
                            "isOptional": "false",
                            "minLength": "12",
                            "maxLength": "12",
                            "regEx": "^(21|29|31|34|35|71)[0-9]{2}[a-zA-Z0-9]{4}[0-9]{4}$"
                        }
                    },
                    "response_json": {
                        "billerInfoResponse": {
                            "responseCode": "000",
                            "biller": {
                                "billerId": "SOUTHCO00ODI01",
                                "billerAliasName": "SOUTHCO",
                                "billerName": "TP Southern Odisha Distribution Limited",
                                "billerCategory": "Electricity",
                                "billerAdhoc": "false",
                                "billerCoverage": "IND-ODI",
                                "billerFetchRequiremet": "MANDATORY",
                                "billerPaymentExactness": "Exact and above",
                                "billerSupportBillValidation": "NOT_SUPPORTED",
                                "supportPendingStatus": "Yes",
                                "supportDeemed": "Yes",
                                "billerStatus": "ACTIVE",
                                "billerTimeout": "480",
                                "billerInputParams": {
                                    "paramInfo": {
                                        "paramName": "Consumer Number",
                                        "dataType": "ALPHANUMERIC",
                                        "isOptional": "false",
                                        "minLength": "12",
                                        "maxLength": "12",
                                        "regEx": "^(21|29|31|34|35|71)[0-9]{2}[a-zA-Z0-9]{4}[0-9]{4}$"
                                    }
                                },
                                "billerAdditionalInfo": "",
                                "billerAmountOptions": "|BASE_BILL_AMOUNT,,,",
                                "billerPaymentModes": {
                                    "paymentModeInfo": [
                                        {
                                            "paymentMode": "Internet Banking",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "Debit Card",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "Credit Card",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "Prepaid Card",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "IMPS",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "Cash",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "UPI",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "Wallet",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "NEFT",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "AEPS",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        },
                                        {
                                            "paymentMode": "Account Transfer",
                                            "minAmount": "1",
                                            "maxAmount": "0"
                                        }
                                    ]
                                },
                                "billerDescription": "",
                                "rechargeAmountInValidationRequest": "",
                                "billerPaymentChannels": {
                                    "paymentChannelInfo": [
                                        {
                                            "paymentChannelName": "INT",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "INTB",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "MOB",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "MOBB",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "POS",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "MPOS",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "ATM",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "BNKBRNCH",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "KIOSK",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "AGT",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        },
                                        {
                                            "paymentChannelName": "BSC",
                                            "minAmount": "100",
                                            "maxAmount": "500000000"
                                        }
                                    ]
                                },
                                "billerAdditionalInfoPayment": "",
                                "planAdditionalInfo": "",
                                "planMdmRequirement": "",
                                "billerResponseType": "",
                                "billerPlanResponseParams": "",
                                "interchangeFeeCCF1": {
                                    "feeCode": "CCF1",
                                    "feeDirection": "C2B",
                                    "flatFee": "0",
                                    "percentFee": "0.00",
                                    "feeMinAmt": "0",
                                    "feeMaxAmt": "2147483647"
                                }
                            }
                        }
                    },
                    "status": 1,
                    "created_on": "2025-09-29T11:37:59.000Z",
                    "biller_fetch_requiremet": "MANDATORY"
                }
            },
            encryptedResponse: {
                encRes: "eyJoZ3pnZmgiOjgwMCwid3pneiI6eyJydyI6OSwieXJvb3ZpX3J3IjoiSExGR1NYTDAwTFdSMDkiLCJmaHZpX3J3Ijo3NiwieXJvb3ZpX216bnYiOiJHSyBIbGZnc3ZpbSBMd3Joc3ogV3JoZ2lyeWZncmxtIE9ybnJndnciLCJ5cm9vdmlfeGxldml6dHYiOm1mb28sInlyb292aV96d3NseCI6bWZvbywid3JoZ2lyeWZnbGlfcnciOiIiLCJubHlyb3ZfbWwiOiIiLCJ4bG1oZm52aV9ydyI6IiIsInlyb292aV94emd2dGxpYiI6IlZvdnhnaXJ4cmdiIiwicm1rZmdfa3ppem5oIjoie1wia3ppem5SbXVsXCI6e1wia3ppem5Nem52XCI6XCJYbG1oZm52aSBNZm55dmlcIixcInd6Z3pHYmt2XCI6XCJaT0tTWk1GTlZJUlhcIixcInJoTGtncmxtem9cIjpcInV6b2h2XCIsXCJucm1Pdm10Z3NcIjpcIjk4XCIsXCJuemNPdm10Z3NcIjpcIjk4XCIsXCJpdnRWY1wiOlwiXig4OXw4MXw3OXw3Nnw3NXwzOSlbMC0xXXs4fVt6LWFaLUEwLTFdezZ9WzAtMV17Nn0kXCJ9fSIsIml2aGtsbWh2X3FobG0iOiJ7XCJ5cm9vdmlSbXVsSXZoa2xtaHZcIjp7XCJpdmhrbG1odlhsd3ZcIjpcIjAwMFwiLFwieXJvb3ZpXCI6e1wieXJvb3ZpUndcIjpcIkhMRkdTWEwwMExXUjA5XCIsXCJ5cm9vdmlab3J6aE16bnZcIjpcIkhMRkdTWExcIixcInlyb292aU16bnZcIjpcIkdLIEhsZmdzdmltIEx3cmhzeiBXcmhnaXJ5ZmdybG0gT3Jucmd2d1wiLFwieXJvb3ZpWHpndnRsaWJcIjpcIlZvdnhnaXJ4cmdiXCIsXCJ5cm9vdmlad3NseFwiOlwidXpvaHZcIixcInlyb292aVhsZXZpenR2XCI"
            }
        },
        {
            id: 3,
            method: 'POST',
            endpoint: '/api/bill_payment/f308eae69c85a45d634afbcc76a5d94609b832dd',
            url: 'https://api.mayway.in/api/bill_payment/f308eae69c85a45d634afbcc76a5d94609b832dd',
            title: 'bbps Bill Fetch',
            description: 'Fetch bbps bill summary with encrypted response example.',
            authentication: true,
            encryption: true,
            requestBody: {
                "biller_id": "SOUTHCO00ODI01",
                "user_id": "34",
                "mobile_no": "9876543210",
                "email_id": "user@example.com",
                "inputParam": {
                    "paramInfo": {
                        "paramName": "Consumer Number",
                        "dataType": "ALPHANUMERIC",
                        "isOptional": "false",
                        "minLength": "12",
                        "maxLength": "12",
                        "regEx": "^(21|29|31|34|35|71)[0-9]{2}[a-zA-Z0-9]{4}[0-9]{4}$",
                        "paramValue": "2101AB123456"
                    }
                }
            },
            encryptedRequestBody: null,

            response: {
                "status": 200,
                "data": {
                    "id": 1,
                    "biller_id": "SOUTHCO00ODI01",
                    "user_id": 34,
                    "biller_name": "TP Southern Odisha Distribution Limited",
                    "consumer_number": "2901CD789012",
                    "distributor_id": "SOUTHCO_DIST",
                    "mobile_no": "9876543210",
                    "consumer_id": "CONS2901789012",
                    "biller_category": "Electricity",
                    "input_params": {
                        "paramInfo": {
                            "paramName": "Consumer Number",
                            "dataType": "ALPHANUMERIC",
                            "isOptional": "false",
                            "minLength": "12",
                            "maxLength": "12",
                            "regEx": "^(21|29|31|34|35|71)[0-9]{2}[a-zA-Z0-9]{4}[0-9]{4}$",
                            "paramValue": "2901CD789012"
                        }
                    },
                    "response_json": "{\"billerInfoResponse\":{\"responseCode\":\"000\",\"biller\":{\"billerId\":\"SOUTHCO00ODI01\",\"billerName\":\"TP Southern Odisha Distribution Limited\",\"billerCategory\":\"Electricity\",\"billerStatus\":\"ACTIVE\"}}}",
                    "status": 1,
                    "created_on": "2025-09-29T11:37:59.000Z",
                    "biller_fetch_requiremet": "MANDATORY"
                }
            },

        },
        {
            id: 4,
            method: 'POST',
            endpoint: '/api/bill_payment/f570e94788c88dc689374a4d3d6ee5db74442b1a',
            url: 'https://api.mayway.in/api/bill_payment/f570e94788c88dc689374a4d3d6ee5db74442b1a',
            title: 'Quick Bill Payment',
            description: 'Make quick bill payment with encrypted request and response examples.',
            authentication: true,
            encryption: true,
            requestBody: {
                "user_id": "34",
                "mobile": "9876543210",
                "biller_id": "SOUTHCO00ODI01",
                "cwallet": "Cashback",
                "amount": "1500.00",
                "inputParam": {
                    "paramInfo": {
                        "paramName": "Consumer Number",
                        "dataType": "ALPHANUMERIC",
                        "isOptional": "false",
                        "minLength": "12",
                        "maxLength": "12",
                        "regEx": "^(21|29|31|34|35|71)[0-9]{2}[a-zA-Z0-9]{4}[0-9]{4}$",
                        "paramValue": "2101AB123456"
                    }
                }
            },
            encryptedRequestBody: {
                enc_data: "eyJ4emd2dGxpYiI6IlZvdnhnaXJ4cmdiIiwia3p0diI6OSwiZmh2aV9ydyI6Ijc5In0=",
            },
            response:
            {
                "status": 200,
                "message": "Electricity bill payment successful",
                "data": {
                    "transaction_id": "TXN20240115123457",
                    "biller_id": "SOUTHCO00ODI01",
                    "amount": 1850.50,
                    "cwallet_used": "Cashback",
                    "cwallet_amount": 75.25,
                    "final_amount": 1775.25,
                    "payment_status": "COMPLETED",
                    "bill_details": {
                        "consumer_name": "Jane Smith",
                        "consumer_number": "2901CD789012",
                        "due_date": "2024-01-28",
                        "bill_period": "Dec 2023",
                        "units_consumed": 325,
                        "outstanding_amount": 1850.50
                    },
                    "transaction_time": "2024-01-15T10:32:00Z",
                    "reference_number": "REF789012346"
                }
            },
            encryptedResponse: {
                enc_response: "eyJzdGF0dXMiOiJzdWNjZXNzIiwidHJhbnNhY3Rpb25faWQiOiJUWE4yMDI0MDExNTEwMzAwMDEiLCJwYXltZW50X3N0YXR1cyI6ImluaXRpYXRlZCIsInVwaV9xcl9jb2RlIjoiaHR0cHM6Ly9hcGkucGF5c2VjdXJlLmNvbS9xci91cGkxMjM0NTYiLCJleHBpcnlfdGltZSI6IjIwMjQtMDEtMTVUMTA6NDU6MDBaIn0=",
            }
        },
    ];

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const copyToClipboard = async (text, fieldName) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(''), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const formatJSON = (obj) => {
        if (!obj) return 'No data required';
        return JSON.stringify(obj, null, 2);
    };

    const toggleEncryptedView = (section, apiId) => {
        setShowEncrypted(prev => ({
            ...prev,
            [`${apiId}_${section}`]: !prev[`${apiId}_${section}`]
        }));
    };

    const renderEncryptionToggle = (api, section) => (
        <Button
            size="small"
            startIcon={<Key />}
            onClick={() => toggleEncryptedView(section, api.id)}
            variant="outlined"
            sx={{ ml: 2 }}
        >
            {showEncrypted[`${api.id}_${section}`] ? 'Show Plain' : 'Show Encrypted'}
        </Button>
    );

    const renderRequestBody = (api) => {
        const showEncryptedReq = showEncrypted[`${api.id}_request`];

        return (
            <StyledCard>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            <Smartphone sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Request Body
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {api.encryption && api.encryptedRequestBody && renderEncryptionToggle(api, 'request')}
                            {api.requestBody && (
                                <Tooltip title="Copy Request Body">
                                    <IconButton
                                        size="small"
                                        onClick={() => copyToClipboard(
                                            formatJSON(showEncryptedReq ? api.encryptedRequestBody : api.requestBody),
                                            'request'
                                        )}
                                        color={copiedField === 'request' ? 'success' : 'default'}
                                    >
                                        <ContentCopy />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>

                    <CodeBlock>
                        <Typography variant="body2" component="pre" sx={{ margin: 0 }}>
                            {formatJSON(
                                showEncryptedReq && api.encryptedRequestBody
                                    ? api.encryptedRequestBody
                                    : api.requestBody
                            )}
                        </Typography>
                    </CodeBlock>

                    {api.encryption && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Security sx={{ mr: 1 }} />
                            {showEncryptedReq
                                ? "Request body is encrypted using AES-256-GCM with digital signature verification."
                                : "Request body is encrypted during transmission using TLS 1.3."
                            }
                        </Alert>
                    )}
                </CardContent>
            </StyledCard>
        );
    };

    const renderResponse = (api) => {
        const showEncryptedRes = showEncrypted[`${api.id}_response`];

        return (
            <StyledCard>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            <Computer sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Response
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {api.encryption && api.encryptedResponse && renderEncryptionToggle(api, 'response')}
                            <Tooltip title="Copy Response">
                                <IconButton
                                    size="small"
                                    onClick={() => copyToClipboard(
                                        formatJSON(showEncryptedRes ? api.encryptedResponse : api.response),
                                        'response'
                                    )}
                                    color={copiedField === 'response' ? 'success' : 'default'}
                                >
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <CodeBlock>
                        <Typography variant="body2" component="pre" sx={{ margin: 0 }}>
                            {formatJSON(
                                showEncryptedRes && api.encryptedResponse
                                    ? api.encryptedResponse
                                    : api.response
                            )}
                        </Typography>
                    </CodeBlock>

                    {api.encryption && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Security sx={{ mr: 1 }} />
                            {showEncryptedRes
                                ? "Response data is encrypted and signed for secure transmission."
                                : "Response data is encrypted during transmission."
                            }
                        </Alert>
                    )}
                </CardContent>
            </StyledCard>
        );
    };

    const renderApiDetail = (api) => (
        <Fade in={true} timeout={500}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <MethodChip method={api.method} label={api.method} />
                        <Typography variant="h4" component="h1" fontWeight="bold">
                            {api.title}
                        </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {api.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Authentication
                            </Typography>
                            <AuthChip required={api.authentication} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Encryption
                            </Typography>
                            <EncryptionChip enabled={api.encryption} />
                        </Grid>
                    </Grid>
                </Box>

                {/* URL Section */}
                <StyledCard>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                                <Code sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Endpoint URL
                            </Typography>
                            <Tooltip title="Copy URL">
                                <IconButton
                                    size="small"
                                    onClick={() => copyToClipboard(api.url, 'url')}
                                    color={copiedField === 'url' ? 'success' : 'default'}
                                >
                                    <ContentCopy />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <CodeBlock>
                            <Typography variant="body2" component="pre" sx={{ margin: 0 }}>
                                {api.url}
                            </Typography>
                        </CodeBlock>
                        {api.encryption && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                <Security sx={{ mr: 1 }} />
                                This endpoint uses TLS 1.3 encryption for secure communication.
                            </Alert>
                        )}
                    </CardContent>
                </StyledCard>

                {/* Parameters */}
                {api.pathParams && (
                    <StyledCard>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Path Parameters
                            </Typography>
                            <Box component="ul" sx={{ pl: 2 }}>
                                {api.pathParams.map((param, index) => (
                                    <Box component="li" key={index} sx={{ mb: 1 }}>
                                        <Typography variant="body2">
                                            <strong>{param.name}</strong> ({param.type}) - {param.description}
                                            {param.required && (
                                                <Chip label="Required" color="error" size="small" sx={{ ml: 1 }} />
                                            )}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </StyledCard>
                )}

                {/* Request Body */}
                {renderRequestBody(api)}

                {/* Response */}
                {renderResponse(api)}

                {copiedField && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        Copied {copiedField} to clipboard!
                    </Alert>
                )}
            </Box>
        </Fade>
    );

    const renderSidebarTabs = () => (
        <SidebarTabs
            orientation="vertical"
            variant="scrollable"
            value={activeTab}
            onChange={handleTabChange}
            sx={{
                flex: '0 0 320px',
                maxHeight: 'calc(100vh - 200px)',
                overflow: 'auto',
            }}
        >
            {apiData.map((api, index) => (
                <Tab
                    key={api.id}
                    icon={<Http />}
                    iconPosition="start"
                    label={
                        <Box sx={{ textAlign: 'left', width: '100%' }}>
                            <MethodChip method={api.method} label={api.method} size="small" />
                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'medium', lineHeight: 1.2 }}>
                                {api.endpoint}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                {api.title}
                            </Typography>
                        </Box>
                    }
                    sx={{
                        alignItems: 'flex-start',
                        py: 1.5,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        '&:last-child': {
                            borderBottom: 'none',
                        },
                    }}
                />
            ))}
        </SidebarTabs>
    );

    const renderMobileTabs = () => (
        <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 3,
                '& .MuiTab-root': {
                    minHeight: 64,
                }
            }}
        >
            {apiData.map((api, index) => (
                <Tab
                    key={api.id}
                    icon={<Http />}
                    iconPosition="start"
                    label={
                        <Box sx={{ textAlign: 'left' }}>
                            <MethodChip method={api.method} label={api.method} size="small" />
                            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'medium' }}>
                                {api.endpoint}
                            </Typography>
                        </Box>
                    }
                    sx={{ minWidth: 200 }}
                />
            ))}
        </Tabs>
    );

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh' }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Introduction */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Secure API Reference
                    </Typography>
                    <Typography variant="h6" color="text.secondary" maxWidth="md" mx="auto">
                        Complete documentation with encrypted request/response examples for secure payment processing
                    </Typography>
                </Box>

                {/* Main Content Layout */}
                {isMobile ? (
                    <Box>
                        {renderMobileTabs()}
                        {renderApiDetail(apiData[activeTab])}
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Paper
                            sx={{
                                flex: '0 0 320px',
                                height: 'fit-content',
                                position: 'sticky',
                                top: 100,
                                borderRadius: 2,
                                overflow: 'hidden',
                            }}
                            elevation={2}
                        >
                            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                <Typography variant="h6" fontWeight="bold">
                                    API Endpoints
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {apiData.length} secure endpoints
                                </Typography>
                            </Box>
                            {renderSidebarTabs()}
                        </Paper>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {renderApiDetail(apiData[activeTab])}
                        </Box>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ApiDocumentation;