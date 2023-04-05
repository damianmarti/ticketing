import { useCallback } from "react";
import { VoidSigner, TypedDataDomain } from "ethers";

export function useTypedSigner(userSigner: VoidSigner, domain: TypedDataDomain) {
    const typedSigner = useCallback(
        async (types: any, value: any) => {
            return await userSigner._signTypedData(domain, types, value);
        },
        [userSigner, domain],
    );

    return typedSigner;
}