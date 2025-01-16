import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function SubscriptionForm() {
    const [selectedPlan, setSelectedPlan] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleSubscribe = () => {
        // Implement your payment gateway logic here
        console.log('Subscribing to:', selectedPlan);
        console.log('Card Number:', cardNumber);
        console.log('Expiry Date:', expiryDate);
        console.log('CVV:', cvv);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Select Plan</label>
                <select
                    className="bg-[#1E1E1E] border-0 h-12 text-white placeholder:text-gray-500 rounded-xl w-full"
                    value={selectedPlan}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                >
                    <option value="">Select a plan</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                </select>
            </div>
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