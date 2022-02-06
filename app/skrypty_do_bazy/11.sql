USE [weppo]
GO

/****** Object:  Table [dbo].[ORDER_CONTENT]    Script Date: 06.02.2022 17:52:57 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[ORDER_CONTENT](
	[order_id] [int] NOT NULL,
	[product_id] [int] NULL,
	[amount] [int] NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ORDER_CONTENT]  WITH CHECK ADD  CONSTRAINT [FK_ORDER_CONTENT_ORDER] FOREIGN KEY([order_id])
REFERENCES [dbo].[ORDER] ([id])
GO

ALTER TABLE [dbo].[ORDER_CONTENT] CHECK CONSTRAINT [FK_ORDER_CONTENT_ORDER]
GO

ALTER TABLE [dbo].[ORDER_CONTENT]  WITH CHECK ADD  CONSTRAINT [FK_ORDER_CONTENT_PRODUCT] FOREIGN KEY([product_id])
REFERENCES [dbo].[PRODUCT] ([id])
GO

ALTER TABLE [dbo].[ORDER_CONTENT] CHECK CONSTRAINT [FK_ORDER_CONTENT_PRODUCT]
GO

