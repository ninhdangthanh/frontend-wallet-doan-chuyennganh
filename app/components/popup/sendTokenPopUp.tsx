"use client";

import "../../../css/fontawesome-free-6.5.1-web/css/all.css"
import "../../../css/bootstrap.min.css"
import "../../../css/main.css"
import "../../../css/send.css"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectedAccount } from "@/redux/slice/accountSlice";
import { ethers } from "ethers";
import { hideApiLoading, showApiLoading } from "@/redux/slice/apiLoadingSlice";
import { toast } from "react-toastify";
import { selectNetwork } from "@/redux/slice/networkSlice";

const tokenAbi = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)"
];



export default function SendTokenPopUp(props: any) {
    const {token, setIsShowSendTokenPopup, getTokenERC20s} = props

    const account = useSelector(selectedAccount);
    const dispatch = useDispatch();
    const network_redux = useSelector(selectNetwork);

    const [toAddress, setToAddress] = useState("")
    const [valueSend, setValueSend] = useState(0)

    useEffect(() => {
        console.log(token.balances, " ", typeof(token.balances));
        
    }, [])

    const handleSendToken = async () => {
        if(toAddress == "" || !toAddress.startsWith("0x")) {
            alert("Please fill in the correct to address.")
            return;
        }
        if(valueSend > Number(token.balances) || valueSend == 0) {
            alert("Please fill in the correct amount.")
            return;
        }
        
        const provider = new ethers.providers.JsonRpcProvider(network_redux.network?.rpc_url);
        
        const wallet = new ethers.Wallet(account.privateKey, provider);
        const tokenContractAddress = token.contract_address;
        const tokenContract = new ethers.Contract(tokenContractAddress, tokenAbi, wallet);

        const amountToSend = ethers.utils.parseUnits(valueSend.toString(), 18);

        dispatch(showApiLoading())
        
        try {
            const transactionResponse = await tokenContract.transfer(toAddress, amountToSend);

            toast.success('Import transaction into blockchain successfully', {
                position: 'top-right',
                autoClose: 8000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });

            try {
                await transactionResponse.wait();
                toast.success('The transaction is successfully processed by the blockchain', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                });

                setIsShowSendTokenPopup(false)
                
            } catch (error) {
                toast.error('The transaction processed by the blockchain failed', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                });
            }

        } catch (error) {
            toast.error('Failed when import transaction into blockchain', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            });
        }

        dispatch(hideApiLoading())

        await getTokenERC20s()
        setValueSend(0)
        setToAddress("")
        
        
        
        setValueSend(0)
        setToAddress("")
    }

    return (
        <>
            <div onClick={() => setIsShowSendTokenPopup(false)} className="overlay"></div>

            <div className="popup-send-container" style={{color: "white"}}>
                <div className="quantity-send-container" style={{color: "white"}}>
                    <div className="quantity-send-title">
                        Send
                    </div>
                    <div onClick={() => setIsShowSendTokenPopup(false)} className="quantity-send-close">
                        Cancel
                    </div>
                    <div className="quantity-send-account">
                        <div className="quantity-send-account-name">
                            From: {account.name}
                        </div>
                        <div className="quantity-send-account-address">
                            {account.address}
                        </div>
                    </div>
                    <div className="quantity-send-account-to">
                        <div className="quantity-send-account-name-to">
                            To:
                        </div>
                        <input value={toAddress} onChange={(e) => setToAddress(e.target.value)} type="text" className="quantity-send-account-input" />
                    </div>
                    <div className="quantity-send-asset flex-row">
                        <div className="quantity-send-amount-title">
                            Assets:
                        </div>
                        <div className="quantity-send-asset-choose flex-row">
                            {/* <img src="./account-1-logologo.png" alt="Send tokens logo" className="quantity-send-asset-choose-logo" /> */}
                            <div className="quantity-send-asset-choose-quantity">
                                <div className="quantity-send-asset-choose-quantity-name">
                                    {token.name}
                                </div>
                                <div className="quantity-send-asset-choose-quantity-balance">
                                    Balance: <strong style={{fontSize: 18}}>{token.balances}</strong> {token.symbol}
                                </div>
                            </div>
                            {/* <i className="fa-solid fa-caret-down"></i> */}
                        </div>
                    </div>
                    <div className="quantity-send-amount flex-row">
                        <div className="quantity-send-amount-title">
                            Amount:
                            {/* <div className="quantity-send-amount-title-max">
                                Max
                            </div> */}
                        </div>
                        <div className="quantity-send-amount-input">
                            <div className="quantity-send-amount-input-top">
                                <input value={valueSend} onChange={e => setValueSend(Number(e.target.value))} type="number" placeholder="0" className="quantity-send-amount-input-top-input"/>
                                <div className="quantity-send-amount-input-title">{token.symbol}</div>
                            </div>
                            <div className="quantity-send-amount-input-bot">
                                No conversion rate avalable
                            </div>
                        </div>
                    </div>
                    <div className="quantity-send-button flex-row">
                        <div onClick={() => setIsShowSendTokenPopup(false)} className="quantity-send-button-cancel">Cancel</div>
                        <div onClick={() => handleSendToken()} className="quantity-send-button-send">Send</div>
                    </div>
                </div>
            </div>
        </>
    );
}
