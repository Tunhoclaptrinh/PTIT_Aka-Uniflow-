export class UpdateTenantDto {
  name?: string;
  subdomain?: string;
  planTier?: string;
  brandTheme?: {
    primaryColor: string;
    secondaryColor: string;
  };
  settings?: {
    autoRetryOnFailure: boolean;
    defaultCarrier: string;
    alertChannels: string[];
  };
}
