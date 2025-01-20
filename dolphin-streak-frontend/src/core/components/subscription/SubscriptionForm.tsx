import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/core/stores/authStore';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';

export function SubscriptionForm() {
    const { getAccessToken } = useAuthStore();
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const accessToken = getAccessToken();

    const { mutate: subscribe, isPending } = trpc.auth.subscribe.useMutation({
        onSuccess: (data) => {
            console.log("Subscription successful", data);
        },
        onError: (error) => {
            console.error("Subscription failed", error);
        }
    });

    const handleSubscribe = () => {
        subscribe({
            card_number: cardNumber,
            card_exp_month: expiryDate.split('/')[0],
            card_exp_year: expiryDate.split('/')[1],
            card_cvv: cvv,
            accessToken: accessToken || '',
        });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Card Number</label>
                <Input
                    type="text"
                    placeholder="Enter card number"
                    className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl w-full"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Expiry Date</label>
                    <Input
                        type="text"
                        placeholder="MM/YY"
                        className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl w-full"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">CVV</label>
                    <Input
                        type="text"
                        placeholder="CVV"
                        className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl w-full"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                    />
                </div>
            </div>
            <Button onClick={handleSubscribe} className="w-full">Subscribe</Button>
        </div>
    );
}