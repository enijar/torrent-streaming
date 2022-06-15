import React from "react";
import {
  LoadingSpinner,
  LoadingWrapper,
} from "@/components/loading/loading.styles";

export default function Loading() {
  return (
    <LoadingWrapper>
      <LoadingSpinner>
        <div />
        <div />
        <div />
        <div />
      </LoadingSpinner>
    </LoadingWrapper>
  );
}
