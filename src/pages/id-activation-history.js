'use client';

import React from 'react';
import Layout from '@/components/Dashboard/layout';
import IdActivationHistoryScreen from '@/components/IdActivationHistory/id-activation-history';

export default function idActivationHistoryPage() {
    return (
        <Layout>
            <IdActivationHistoryScreen />
        </Layout>
    );
}
