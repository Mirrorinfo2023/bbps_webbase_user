import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Paper,
  Container,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {
  AccountBalanceWallet,
  Send,
  Book,
  DirectionsCar,
  Campaign,
  WhatsApp,
  Telegram,
  Email,
  Phone,
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  BusinessCenter as BusinessCenterIcon,
  ShoppingCart
} from '@mui/icons-material';



// Stats Component
const StatsCard = ({ title, value, subtitle }) => {
  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
          {value}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};
// Cashback Category Component
const CashbackCategory = ({ percentage, category, description, icon, gradient }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: 3, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      background: gradient || 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid rgba(255,255,255,0.8)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': { 
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        '& .category-icon': {
          transform: 'scale(1.1) rotate(5deg)'
        },
        '& .percentage-chip': {
          background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
          color: 'white'
        }
      }
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '80px',
        height: '80px',
        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '0 0 0 100%'
      }} />
      
      <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Chip 
            label={`CB upto ${percentage}`} 
            className="percentage-chip"
            sx={{ 
              fontWeight: 800,
              fontSize: '0.75rem',
              height: '28px',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              boxShadow: '0 2px 8px rgba(102,126,234,0.3)',
              transition: 'all 0.3s ease'
            }}
          />
          <Box 
            className="category-icon"
            sx={{ 
              color: 'primary.main', 
              fontSize: '2.5rem',
              opacity: 0.9,
              transition: 'all 0.3s ease',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
            }}
          >
            {icon}
          </Box>
        </Box>
        
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2c3e50, #34495e)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: '1.3rem',
            mb: 1
          }}
        >
          {category}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            lineHeight: 1.5,
            fontSize: '0.9rem',
            opacity: 0.8
          }}
        >
          {description}
        </Typography>
        
        {/* Progress indicator */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            flexGrow: 1, 
            height: '4px', 
            background: 'rgba(0,0,0,0.1)', 
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <Box sx={{
              width: '60%',
              height: '100%',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }} />
          </Box>
          <Typography variant="caption" sx={{ ml: 1, fontWeight: 600, color: 'primary.main' }}>
            Popular
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Updated cashback data with all categories
const cashbackData = [
  { 
    percentage: "5%", 
    category: "Recharge & Bills", 
    description: "Loan EMI, Electricity, Rent Credit card",
    icon: <AccountBalanceWallet sx={{ fontSize: 'inherit' }} />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  { 
    percentage: "10%", 
    category: "Shopping", 
    description: "Online purchase, Fashion, electronics",
    icon: <ShoppingCart sx={{ fontSize: 'inherit' }} />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  { 
    percentage: "20%", 
    category: "Leads", 
    description: "Business leads and opportunities",
    icon: <BusinessCenterIcon sx={{ fontSize: 'inherit' }} />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  { 
    percentage: "5%", 
    category: "E-book", 
    description: "Digital book purchases, Free Kindle Books",
    icon: <Book sx={{ fontSize: 'inherit' }} />,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  { 
    percentage: "10%", 
    category: "Insurance & Loan", 
    description: "Health, Life Vehicle insurance",
    icon: <Campaign sx={{ fontSize: 'inherit' }} />,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  { 
    percentage: "0.5%", 
    category: "Commute", 
    description: "FAST tag, metro, transportation",
    icon: <DirectionsCar sx={{ fontSize: 'inherit' }} />,
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  },
  { 
    percentage: "20%", 
    category: "Affiliate", 
    description: "Affiliate marketing earnings",
    icon: <Campaign sx={{ fontSize: 'inherit' }} />,
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  }
];

// Usage in main component
const CashbackSection = () => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
        >
          Cashback Categories
        </Typography>
        <Grid container spacing={3}>
          {cashbackData.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CashbackCategory
                percentage={item.percentage}
                category={item.category}
                description={item.description}
                icon={item.icon}
                gradient={item.gradient}
              />
            </Grid>
          ))}
        </Grid>
        
        {/* Summary Section */}
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
          border: '1px solid rgba(102,126,234,0.2)',
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Maximize Your Earnings
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.8 }}>
            Earn cashback on every transaction across all categories
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Wallet Section Component
const WalletSection = () => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <CardContent sx={{ p: 4, color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Wallet Balance
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <AccountBalanceWallet sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h6" gutterBottom>
                Wallet Point
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                 0.0
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <AccountBalanceWallet sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h6" gutterBottom>
                Cashback Point
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                 0.0
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button 
              variant="contained" 
              fullWidth
              startIcon={<AccountBalanceWallet />}
              sx={{ 
                backgroundColor: 'white',
                color: 'primary.main',
                fontWeight: 600,
                fontSize: '1.1rem',
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'grey.100'
                }
              }}
            >
              Add Money
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              variant="outlined" 
              fullWidth
              startIcon={<Send />}
              sx={{ 
                borderColor: 'white',
                color: 'white',
                fontWeight: 600,
                fontSize: '1.1rem',
                py: 1.5,
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'grey.300',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Send Money
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Referral Section Component
const ReferralSection = () => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E53 100%)' }}>
      <CardContent sx={{ p: 4, textAlign: 'center', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          REFER & EARN RS 500 CASHBACK ON PER REFER
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
          Earn assured ₹50 per referral
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            backgroundColor: 'white',
            color: '#FF6B6B',
            fontWeight: 700,
            fontSize: '1.2rem',
            px: 6,
            py: 1.5,
            borderRadius: 3,
            '&:hover': {
              backgroundColor: 'grey.100',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s'
          }}
        >
          REFER NOW
        </Button>
      </CardContent>
    </Card>
  );
};

// Social Links Component
const SocialLinks = () => {
  const socialPlatforms = [
    { name: 'WhatsApp', icon: <WhatsApp />, color: '#25D366' },
    { name: 'Telegram', icon: <Telegram />, color: '#0088cc' },
    { name: 'Gmail', icon: <Email />, color: '#EA4335' },
    { name: 'Call', icon: <Phone />, color: '#34B7F1' }
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Connect with us
        </Typography>
        <Grid container spacing={2}>
          {socialPlatforms.map((platform, index) => (
            <Grid item xs={6} key={index}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={platform.icon}
                sx={{
                  justifyContent: 'flex-start',
                  color: platform.color,
                  borderColor: platform.color,
                  fontWeight: 600,
                  py: 2,
                  borderRadius: 2,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: platform.color,
                    backgroundColor: `${platform.color}10`
                  }
                }}
              >
                {platform.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

// Quick Actions Component
const QuickActions = () => {
  const actions = [
    { 
      name: 'Shopping', 
      icon: <Campaign sx={{ fontSize: 28 }} />, 
      color: '#FF6B6B',
      description: 'Online purchases'
    },
    { 
      name: 'Utilities', 
      icon: <AccountBalanceWallet sx={{ fontSize: 28 }} />, 
      color: '#4ECDC4',
      description: 'Bills & Payments'
    },
    { 
      name: 'Leads', 
      icon: <BusinessCenterIcon sx={{ fontSize: 28 }} />, 
      color: '#45B7D1',
      description: 'Business opportunities'
    },
    { 
      name: 'Affiliate', 
      icon: <Campaign sx={{ fontSize: 28 }} />, 
      color: '#96CEB4',
      description: 'Marketing earnings'
    }
  ];

  return (
    <Card sx={{ 
      borderRadius: 3, 
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: '1px solid rgba(255,255,255,0.8)',
      backdropFilter: 'blur(10px)',
      height: '100%',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 700, 
            mb: 3,
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center'
          }}
        >
          Quick Actions
        </Typography>
        
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid item xs={6} key={index}>
              <Button
                fullWidth
                variant="contained"
                startIcon={React.cloneElement(action.icon, { 
                  sx: { color: 'white' } 
                })}
                sx={{
                  justifyContent: 'flex-start',
                  fontWeight: 600,
                  py: 2.5,
                  borderRadius: 3,
                  fontSize: '0.9rem',
                  height: '90px',
                  background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}99 100%)`,
                  boxShadow: `0 4px 15px ${action.color}40`,
                  textTransform: 'none',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${action.color}60`,
                    background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}CC 100%)`
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                <Box sx={{ textAlign: 'left', width: '100%' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'white',
                      fontSize: '0.9rem',
                      lineHeight: 1.2,
                      mb: 0.5
                    }}
                  >
                    {action.name}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.7rem',
                      lineHeight: 1,
                      display: 'block'
                    }}
                  >
                    {action.description}
                  </Typography>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Additional quick stats */}
        <Box 
          sx={{ 
            mt: 3, 
            p: 2, 
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
            border: '1px solid rgba(102,126,234,0.2)'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
              textAlign: 'center'
            }}
          >
            Fast access to frequently used features
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Affiliate Partner Component
const AffiliatePartner = () => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, height: '100%' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Affiliate Partner
          </Typography>
          <Button variant="text" color="primary" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            View All →
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Explore our affiliate marketing opportunities and maximize your earnings
        </Typography>
      </CardContent>
    </Card>
  );
};

// Unlocked Section Component
const UnlockedSection = () => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, border: '3px dashed', borderColor: 'primary.main', height: '100%' }}>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          Unlocked for you
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'text.secondary' }}>
          Earn assured ₹50 per referral
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            fontWeight: 700,
            fontSize: '1.1rem',
            px: 4,
            py: 1.5,
            borderRadius: 2
          }}
        >
          Refer Now
        </Button>
      </CardContent>
    </Card>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const cashbackData = [
    { percentage: "5%", category: "E-book", description: "Digital book purchases", icon: <Book /> },
    { percentage: "10%", category: "Insurance & Loan", description: "Health, Life Vehicle", icon: <AccountBalanceWallet /> },
    { percentage: "0.5%", category: "Commute", description: "FAST tag, metro", icon: <DirectionsCar /> },
    { percentage: "20%", category: "Affiliates", description: "Affiliate marketing earnings", icon: <Campaign /> }
  ];

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          
          {/* Left Column - Stats and Social */}
          <Grid item xs={12} lg={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <StatsCard 
                  title="0+ mirror hub Users"
                  value="📧 0.00"
                  subtitle="have earned more than till now !"
                />
              </Grid>
              <Grid item xs={12}>
                <SocialLinks />
              </Grid>
              <Grid item xs={12}>
                <QuickActions />
              </Grid>
            </Grid>
          </Grid>

          {/* Middle Column - Wallet and Cashback */}
          <Grid item xs={12} lg={6}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <WalletSection />
              </Grid>
              
              <Grid item xs={12}>
                <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
                      Cashback Categories
                    </Typography>
                    <Grid container spacing={3}>
                      {cashbackData.map((item, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <CashbackCategory
                            percentage={item.percentage}
                            category={item.category}
                            description={item.description}
                            icon={item.icon}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column - Referral and Offers */}
          <Grid item xs={12} lg={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <ReferralSection />
              </Grid>
              <Grid item xs={12}>
                <AffiliatePartner />
              </Grid>
              <Grid item xs={12}>
                <UnlockedSection />
              </Grid>
            </Grid>
          </Grid>

        </Grid>

        {/* Footer Section */}
        <Box sx={{ textAlign: 'center', mt: 8, mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            What makes online brib the
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, color: 'text.primary' }}>
            Over 0+
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;