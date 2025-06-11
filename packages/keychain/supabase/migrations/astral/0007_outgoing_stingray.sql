ALTER POLICY "Organization Members: Organization members are visible to org peers" ON "organization_members" TO authenticated USING (is_member_of_org(organization_id));--> statement-breakpoint
ALTER POLICY "Organization Members: Organization admins can manage org members (add, update, delete)" ON "organization_members" TO authenticated USING (
      role = 'admin'
      AND is_member_of_org(organization_id)
      )